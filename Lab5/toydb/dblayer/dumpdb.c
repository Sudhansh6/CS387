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

   // UNIMPLEMENTED;
    for (int i = 0; i < schema->numColumns; i++) {
        switch (schema->columns[i]->type) {
            case VARCHAR:
                printf("%s", DecodeCString(cursor, len, NULL));
                break;
            case INT:
                printf("%d", DecodeInt(cursor));
                break;
            case LONG:
                printf("%ld", DecodeLong(cursor));
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
sequential_scan()
{

}

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
}

int
main(int argc, char **argv) {
    char *schemaTxt = "Country:varchar, Capital:varchar, Population:int";
    Schema *schema = parseSchema(schemaTxt);
    Table *tbl;

    //UNIMPLEMENTED;
    if (argc == 2 && *(argv[1]) == 's') {
        // invoke Table_Scan with printRow, which will be invoked for each row in the table.
        Table_Scan(tbl, schema, printRow);
    } else {
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
