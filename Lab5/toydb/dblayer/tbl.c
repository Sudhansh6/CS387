#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include "tbl.h"
#include "codec.h"
#include "../pflayer/pf.h"

#define SLOT_COUNT_OFFSET 2
#define checkerr(err) {if (err < 0) {PF_PrintError(); exit(EXIT_FAILURE);}}

int  getLen(int slot, byte *pageBuf);
int  getNumSlots(byte *pageBuf);
void setNumSlots(byte *pageBuf, int nslots); 
int  getNthSlotOffset(int slot, char* pageBuf); 

// Check for github
/**
   Opens a paged file, creating one if it doesn't exist, and optionally
   overwriting it.
   Returns 0 on success and a negative error code otherwise.
   If successful, it returns an initialized Table*.
 */
int
Table_Open(char *dbname, Schema *schema, bool overwrite, Table **ptable)
{
    //UNIMPLEMENTED;
    // Initialize PF, create PF file,
    // allocate Table structure  and initialize and return via ptable
    // The Table structure only stores the schema. The current functionality
    // does not really need the schema, because we are only concentrating
    // on record storage. 
    
    // Overwrite the file if it exists
    if(overwrite){
        int dest_file = PF_DestroyFile(dbname);
        printf("Got into the destroyer\n");
        if(dest_file < 0){
            PF_PrintError();
            printf("Error: Could not destroy file %s\n", dbname);
            exit(EXIT_FAILURE);
        }
    }

    // Create the file
    PF_Init();
    int new_file = PF_CreateFile(dbname);
    if (new_file < 0) {
        PF_PrintError();
        printf("Error in creating the file %s\n", dbname);
        return new_file;
    }
    
    // Open the file
    int open_file = PF_OpenFile(dbname);
    printf("File is opened,%d\n",open_file);
    if (open_file < 0) {
        PF_PrintError();
        printf("Error in opening the file %s\n", dbname);
        return open_file;
    }
    // Allocate the table
    Table *table = malloc(sizeof(Table));
    if (table == NULL) {
        printf("Error: Could not allocate table\n");
        return -1;
    }
    printf("Table is allocated\n");

    // Initialize the table
    table->schema = schema;
    printf("Schema is copied\n");
    table->rowoff = NULL;
    printf("Rowoff is set to NULL\n");
    table->fd = open_file;
    printf("File descriptor is set\n");
    
    table->dbname = dbname;
    table->numSlots = 0;
    table->curr_page = 0;
    *ptable = table;
    table->max_len = 0;

    // Allocating first page
    char *pageBuf;
    int first_page = PF_AllocPage(open_file, &(table->curr_page), &pageBuf);
    printf("First Page is allocated\n");
    // Set pointer to empty page
    EncodeInt(PF_PAGE_SIZE, pageBuf);
    printf("First page is encoded\n");
    // Set number of slots to page
    setNumSlots(pageBuf, 0);
    PF_UnfixPage(open_file, table->curr_page, TRUE);

    return 0;
}

void
Table_Close(Table *tbl) {
    //UNIMPLEMENTED;

    // Unfix any dirty pages, close file.

    // Close the file
    printf("Closing the file, %d\n",tbl->fd);
    int curr_fd=tbl->fd;
    int closefile = PF_CloseFile(curr_fd);
    if (closefile < 0) {
        PF_PrintError();
        printf("Error in closing the file %s\n", tbl->dbname);
        exit(EXIT_FAILURE);
    }
}
int getLen(int slot, byte *pageBuf){
    if(slot == 1){
        return PF_PAGE_SIZE - getNthSlotOffset(slot, pageBuf);
    }
    else{
        return getNthSlotOffset(slot, pageBuf) - getNthSlotOffset(slot-1, pageBuf);
    }
}
int getNthSlotOffset(int slot, char* pageBuf){
    int numSlots = getNumSlots(pageBuf);
    return 8+(numSlots-1)*4;
}
int getFreelen(byte *pageBuf){
    int getfreeptr = DecodeInt(pageBuf);
    int freelen= PF_PAGE_SIZE - getfreeptr+8+getNumSlots(pageBuf)*4;
    return PF_PAGE_SIZE-freelen;
}
int getFreeslot(byte *pageBuf){
    int getfreeptr = DecodeInt(pageBuf);
    return getfreeptr;
}
int setFreeslot(byte *pageBuf, int freeslot){
    EncodeInt(freeslot, pageBuf);
    return 0;
}
int
Table_Insert(Table *tbl, byte *record, int len, RecId *rid) {
    // Allocate a fresh page if len is not enough for remaining space
    // Get the next free slot on page, and copy record in the free
    // space
    // Update slot and free space index information on top of page.

    // Get the current page
    
    printf("Table_Insert is called\n");
    char *temp_buff;
    int page_err = PF_GetThisPage(tbl->fd, tbl->curr_page, &temp_buff);
    if(page_err < 0){
        PF_PrintError();
        printf("Error in getting the current page %d\n", tbl->curr_page);
        exit(EXIT_FAILURE);
    }
    int free_len=getFreelen(temp_buff);
    printf("Free length is %d\n", free_len);
    printf("Record length is %d\n", len);
//    int free_len = getLen(tbl->numSlots, temp_buff);
    if(free_len<len+4){
        PF_UnfixPage(tbl->fd, tbl->curr_page, TRUE);
        int new_page_err = PF_AllocPage(tbl->fd, &(tbl->curr_page), &temp_buff);
        printf("New page is allocated\n");
        if(new_page_err < 0){
            PF_PrintError();
            printf("Error in allocating a new page\n");
            exit(EXIT_FAILURE);
        }
        // Set pointer to empty Space
        EncodeInt(PF_PAGE_SIZE, temp_buff);
        // Set number of slots to page
        setNumSlots(temp_buff, 0);
    }
    // Get the free slot pointer from the start of the page
    int free_slot = getFreeslot(temp_buff);
    printf("Free slot is %d\n", free_slot);
    // Copy the data into the free slot
    memcpy(temp_buff+free_slot,record,len);
    printf("Data is copied\n");
    free_slot-=len;
    // Update the slot information
    setFreeslot(temp_buff, free_slot);
    printf("Free slot is updated\n");
    // Update the number of slots
    setNumSlots(temp_buff, tbl->numSlots+1);
    tbl->numSlots++;
    printf("Number of slots is %d\n", tbl->numSlots);
    
    // Add the slot to the rowoff array
    int slot_offset = getNthSlotOffset(tbl->numSlots, temp_buff);
    printf("Slot offset is %d\n", slot_offset);
    
    memcpy(temp_buff+slot_offset, &free_slot, sizeof(int));
    printf("%d\n",free_slot);
    PF_UnfixPage(tbl->fd, tbl->curr_page, TRUE);
    printf("%d, %d \n",tbl->fd,tbl->curr_page);
    *rid=tbl->numSlots+(tbl->curr_page<<16);
    return 0;
}

#define checkerr(err) {if (err < 0) {PF_PrintError(); exit(EXIT_FAILURE);}}

/*
  Given an rid, fill in the record (but at most maxlen bytes).
  Returns the number of bytes copied.
 */
int
Table_Get(Table *tbl, RecId rid, byte *record, int maxlen) {
    int slot = rid & 0xFFFF;
    int pageNum = rid >> 16;

    //UNIMPLEMENTED;
    // PF_GetThisPage(pageNum)
    // In the page get the slot offset of the record, and
    // memcpy bytes into the record supplied.
    // Unfix the page
    char *temp_buff;
    int errval = PF_GetThisPage(tbl->fd, pageNum, &temp_buff);
    if (errval < 0) {
        PF_PrintError();
        printf("Error in getting the page %d\n", pageNum);
        exit(EXIT_FAILURE);
    }
    int offset = getNthSlotOffset(slot, temp_buff);
    int len = getLen(slot, temp_buff);
    if(len > maxlen){
        printf("Error: Record is too large\n");
        exit(EXIT_FAILURE);
    }
    memcpy(record, temp_buff + offset, len);
    PF_UnfixPage(tbl->fd, pageNum, TRUE);
    return len; // return size of record
}

void
Table_Scan(Table *tbl, void *callbackObj, ReadFunc callbackfn) {

    //UNIMPLEMENTED;

    // For each page obtained using PF_GetFirstPage and PF_GetNextPage
    //    for each record in that page,
    //          callbackfn(callbackObj, rid, record, recordLen)
    int pageNum = 0;
    int slot = 0;
    int offset = 0;
    int len = 0;
    char* temp_buff;
    int errval = PF_GetFirstPage(tbl->fd, &pageNum, &temp_buff);
    if (errval < 0) {
        PF_PrintError();
        printf("Error in getting the first page\n");
        exit(EXIT_FAILURE);
    }
    while(pageNum != -1){
        for(slot = 0; slot < getNumSlots(temp_buff); slot++){
            offset = getNthSlotOffset(slot, temp_buff);
            len = getLen(slot, temp_buff);
            int record_pos;
            memcpy(record_pos, temp_buff + offset, 4);
            DecodeCString()
            callbackfn(callbackObj, (pageNum << 16) | slot, temp_buff+record_pos, len);
        }
        errval = PF_GetNextPage(tbl->fd, &pageNum, &temp_buff);
        if (errval < 0) {
            PF_PrintError();
            printf("Error in getting the next page\n");
            exit(EXIT_FAILURE);
        }
    }
}

void setNumSlots(char* buff, int numSlots){
    *(int*)(buff + 4) = numSlots;
}

int getNumSlots(char* buff){
    int numSlots = *(int*)(buff + 4);
    return numSlots;
}

