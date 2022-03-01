#include <stdio.h>
#include <stdlib.h>
#include "codec.h"
#include "tbl.h"
#include "util.h"
#include "../pflayer/pf.h"
#include "../amlayer/am.h"
#define checkerr(err) {if (err < 0) {PF_PrintError(); exit(1);}}

/*
The following function prints the input row
*/
void
printRow(void *callbackObj, RecId rid, byte *row, int len) {
    Schema *schema = (Schema *) callbackObj;
    byte *cursor = row;
    char buf[len];
    int cur = 0;
   // UNIMPLEMENTED;
    for (int i = 0; i < schema->numColumns; i++) {
        switch (schema->columns[i]->type) {
            case VARCHAR:
                cur += DecodeCString(cursor + cur, buf, len) + 2;
                printf("%s", buf);
                break;
            case INT:
                printf("%d", DecodeInt(cursor + cur));
                cur += 4;
                break;
            case LONG:
                printf("%lld", DecodeLong(cursor + cur));
                cur += 4;
                break;
            default:
                printf("Error: Unknown type %d\n", schema->columns[i]->type);
                exit(1);
        }
        if (i < schema->numColumns - 1) {
            printf(",");
        }
    }
    printf("\n");
}

#define DB_NAME "data.db"
#define INDEX_NAME "data.db.0"

void
index_scan(Table *tbl, Schema *schema, int indexFD, int op, int value) {
  //  UNIMPLEMENTED;
    /*
    Open index ...
    while (true) {
	find next entry in index
	fetch rid from table
        printRow(...)
    }
    close index ...
    */
   int scanDesc = AM_OpenIndexScan(indexFD, 'i', 4, op, (char*) (&value));
   int rid = AM_FindNextEntry(scanDesc);
 
   while(rid != AME_EOF){
       byte *record = malloc(PF_PAGE_SIZE);
       int len = PF_PAGE_SIZE;
       Table_Get(tbl, rid, record, len);
       printRow(schema, rid, record, len);
       free(record);
       rid = AM_FindNextEntry(scanDesc);
   }
   checkerr(AM_CloseIndexScan(scanDesc));
}

int
main(int argc, char **argv) {
    char *schemaTxt = "Country:varchar, Capital:varchar, Population:int";
    Schema *schema = parseSchema(schemaTxt);
    Table *tbl;
    Table_Open(DB_NAME, schema, false, &tbl);
    //UNIMPLEMENTED;
    if (argc == 2 && *(argv[1]) == 's') {
        // invoke Table_Scan with printRow, which will be invoked for each row in the table.
        Table_Scan(tbl, schema, printRow);
    }
    else if (argc == 4 && *(argv[1]) == 'i') {
        // invoke index_scan with printRow, which will be invoked for each row in the table.
        int indexFD = PF_OpenFile(INDEX_NAME);
        int op = atoi(argv[2]);
        int value = atoi(argv[3]);
        index_scan(tbl, schema, indexFD, op, value);
    }
    else {
	// index scan by default
        int indexFD = PF_OpenFile(INDEX_NAME);
        checkerr(indexFD);
        // Ask for populations less than 100000, then more than 100000. Together they should
        // yield the complete database.
        index_scan(tbl, schema, indexFD, LESS_THAN_EQUAL, 100000);
        index_scan(tbl, schema, indexFD, GREATER_THAN, 100000);
    }
    Table_Close(tbl);
}
