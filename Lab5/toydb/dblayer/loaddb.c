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

    // Open main db file
    Schema *sch = parseSchema(line);
    Table *tbl;

   //UNIMPLEMENTED;
    // Load data
    int tbl_err = Table_Open(DB_NAME, sch, true, &tbl);
    if(tbl_err < 0){
        PF_PrintError();
        printf("Error: Could not open table %s\n", DB_NAME);
        exit(EXIT_FAILURE);
    }

    char *tokens[MAX_TOKENS];
    char record[MAX_PAGE_SIZE];

    int file_desc = PF_OpenFile(INDEX_NAME);
    if (file_desc >= 0)
    {
        int pg_num = 0;
        char* pg_buf;
        // Unfix all pages
        while(PF_GetNextPage(file_desc, &pg_num, &pg_buf) >= 0)
        {
            PF_UnfixPage(file_desc, pg_num, TRUE);
        }
        // Close the file
        checkerr(PF_CloseFile(file_desc));
        // Delete the existing file
        checkerr(PF_DestroyFile(INDEX_NAME));
    }
    int index = AM_CreateIndex(DB_NAME, 0, 'i', 4);   
    int indexFD = PF_OpenFile(INDEX_NAME);    

    if (index != AME_OK)
    {
        PF_PrintError();
        printf("Error: Could not create index\n");
        exit(EXIT_FAILURE);
    }
   
    while ((line = fgets(buf, MAX_LINE_LEN, fp)) != NULL) {
        int n = split(line, ",", tokens);
        assert (n == sch -> numColumns);
        int len = encode(sch, tokens, record, sizeof(record));
        RecId rid;

    //    UNIMPLEMENTED;
        int rid_err = Table_Insert(tbl, record, len, &rid);
        checkerr(rid_err);
        //    UNIMPLEMENTED;
        // Indexing on the population column 
        
        // Use the population field as the field to index on
        int population = atoi(tokens[2]);
        int index_err = AM_InsertEntry(indexFD, 'i', 4, (char*)&population, rid);
        checkerr(index_err); 
        printf("%s, %s, %d\n", tokens[0], tokens[1], population);   
    }
//    printf("-------------------------------------\n");
    fclose(fp);
    Table_Close(tbl);
    PF_CloseFile(file_desc);
    return sch;
}

int
main() {
    loadCSV();
}
