#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <ctype.h>
#include "codec.h"
#include "../pflayer/pf.h"
#include "../amlayer/am.h"
#include "tbl.h"
#include "util.h"

#define checkerr(err) {if (err < 0) {PF_PrintError(); exit(1);}}

#define MAX_PAGE_SIZE 4000


#define DB_NAME "data.db"
#define INDEX_NAME "data.db.0"
#define CSV_NAME "data.csv"


/*
Takes a schema, and an array of strings (fields), and uses the functionality
in codec.c to convert strings into compact binary representations
 */
int
encode(Schema *sch, char **fields, byte *record, int spaceLeft) {
    //UNIMPLEMENTED;

    // for each field
    //    switch corresponding schema type is
    //        VARCHAR : EncodeCString
    //        INT : EncodeInt
    //        LONG: EncodeLong
    // return the total number of bytes encoded into record
    
    int totalBytes = 0;
    int i;
    for(i = 0; i < sch->numColumns; i++){
        switch(sch->columns[i]->type){
            case VARCHAR:
                totalBytes += EncodeCString(fields[i], record + totalBytes, spaceLeft - totalBytes);
                break;
            case INT:
                totalBytes += EncodeInt(atoi(fields[i]), record + totalBytes);
                break;
            case LONG:
                totalBytes += EncodeLong(atol(fields[i]), record + totalBytes);
                break;
            default:
                printf("Error: Unknown type %d\n", sch->columns[i]->type);
                exit(1);
        }
    }
    return totalBytes;
}

Schema *
loadCSV() {
//    printf("Hello\n");
    // Open csv file, parse schema
    FILE *fp = fopen(CSV_NAME, "r");
    if (!fp) {
	perror("data.csv could not be opened");
        exit(EXIT_FAILURE);
    }

    char buf[MAX_LINE_LEN];
    char *line = fgets(buf, MAX_LINE_LEN, fp);
    if (line == NULL) {
	fprintf(stderr, "Unable to read data.csv\n");
	exit(EXIT_FAILURE);
    }
//    printf("Hi\n");
    // Open main db file
    Schema *sch = parseSchema(line);
    Table *tbl;
//    printf("Hi\n");
   //UNIMPLEMENTED;
    int tbl_err = Table_Open(DB_NAME, sch, true, &tbl);
    printf("Table is succesfully Opened\n");
    if(tbl_err < 0){
        PF_PrintError();
        printf("Error: Could not open table %s\n", DB_NAME);
        exit(EXIT_FAILURE);
    }
    int indexFD = tbl->fd;
    printf("Opened table %s\n", DB_NAME);

    char *tokens[MAX_TOKENS];
    char record[MAX_PAGE_SIZE];
    printf("-------------------------------------\n");
    while ((line = fgets(buf, MAX_LINE_LEN, fp)) != NULL) {
        int n = split(line, ",", tokens);
        assert (n == sch -> numColumns);
        int len = encode(sch, tokens, record, sizeof(record));
        RecId rid;
        printf("%d,%s\n", n, sch->columns[1]->name);
        
    //    UNIMPLEMENTED;
        int rid_err =Table_Insert(tbl, record, len, &rid);
        if(rid_err < 0){
            PF_PrintError();
            printf("Error: Could not insert record\n");
            exit(EXIT_FAILURE);
        }
        
        printf("%d %s\n", rid, tokens[0]);

        // Indexing on the population column 
        int population = atoi(tokens[2]);

    //    UNIMPLEMENTED;
        // Use the population field as the field to index on
        
        int index_err = AM_InsertEntry(indexFD, 'i', 4, tokens[2], rid);
        if(index_err < 0){
            PF_PrintError();
            printf("Error: Could not insert index\n");
            exit(EXIT_FAILURE);
        }
    //    checkerr(err);
    }
    fclose(fp);
    Table_Close(tbl);
    int err = PF_CloseFile(indexFD);
    checkerr(err);
    return sch;
}

int
main() {
    printf("Loading data.csv\n");
    loadCSV();
}
