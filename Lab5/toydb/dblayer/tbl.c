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
    
    // Allocate the table
    Table *table = malloc(sizeof(Table));
    if (table == NULL) {
        printf("Error: Could not allocate table\n");
        return -1;
    }
    // Initialize the table
    table->schema = schema;
    table->rowoff = NULL;
    table->dbname = dbname;
    table->numSlots = 0;
    table->curr_page = 0;
    *ptable = table;

    // Allocating file
    int file_error = PF_OpenFile(dbname), open_file;
    if (file_error >= 0)
    {
        if (overwrite)
        {
            checkerr(PF_CloseFile(file_error));
            checkerr(PF_DestroyFile(dbname));
            checkerr(PF_CreateFile(dbname));
        }
    }
    else
    {
        checkerr(PF_CreateFile(dbname));
    }
    open_file = PF_OpenFile(dbname);
    table -> fd = open_file;
    
    // Allocating first page
    char *pageBuf;
    int first_page = PF_AllocPage(open_file, &(table->curr_page), &pageBuf);

    // Set pointer to empty page
    EncodeShort(PF_PAGE_SIZE, pageBuf);
    
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
        printf("HI\n");
        return PF_PAGE_SIZE - getNthSlotOffset(slot, pageBuf);
    }
    else{
        printf("Hello\n");
        return getNthSlotOffset(slot-1, pageBuf) - getNthSlotOffset(slot, pageBuf);
    }
}

int getNthSlotOffset(int slot, char* pageBuf){
    //int numSlots = getNumSlots(pageBuf);
    int slot_val=DecodeInt(slot*4+pageBuf);
    return slot_val;
}

int getFreelen(byte *pageBuf){
    int getfreeptr = DecodeShort(pageBuf);
    int freelen= PF_PAGE_SIZE - getfreeptr+4+getNumSlots(pageBuf)*4;
    return PF_PAGE_SIZE-freelen;
}

int getFreeslot(byte *pageBuf){
    int getfreeptr = DecodeShort(pageBuf);
    return getfreeptr;
}

int setFreeslot(byte *pageBuf, int freeslot){
    EncodeShort(freeslot, pageBuf);
    return 0;
}

int
Table_Insert(Table *tbl, byte *record, int len, RecId *rid) {
    // Allocate a fresh page if len is not enough for remaining space
    // Get the next free slot on page, and copy record in the free
    // space
    // Update slot and free space index information on top of page.

    // Get the current page
    char *temp_buff;
    int page_err = PF_GetThisPage(tbl->fd, tbl->curr_page, &temp_buff);
    if(page_err < 0){
        PF_PrintError();
        printf("Error in getting the current page %d\n", tbl->curr_page);
        exit(EXIT_FAILURE);
    }


    int free_len = getFreelen(temp_buff);
    if(free_len < len + 4){
        PF_UnfixPage(tbl->fd, tbl->curr_page, TRUE);
        int new_page_err = PF_AllocPage(tbl->fd, &(tbl->curr_page), &temp_buff);
        // printf("New page is allocated\n");
        if(new_page_err < 0){
            PF_PrintError();
            printf("Error in allocating a new page\n");
            exit(EXIT_FAILURE);
        }
        // Set pointer to empty Space
        EncodeShort(PF_PAGE_SIZE, temp_buff);
        // Set number of slots to page
        setNumSlots(temp_buff, 0);
    }

    // Get the free slot pointer from the start of the page
    int free_slot = getFreeslot(temp_buff);
    // Copy the data into the free slot
    printf("Free slot is %d\n", free_slot);
    printf("Free length is %d\n", free_len);
    free_slot -= len;
    memcpy(temp_buff+free_slot, record, len);
    
    // Update the slot information
    setFreeslot(temp_buff, free_slot);
    // Update the number of slots
    setNumSlots(temp_buff, tbl->numSlots+1);
    tbl->numSlots++;
   
    // Add the slot to the rowoff array
    int curr_slot_offset = 4*tbl->numSlots;
    EncodeInt(free_slot, temp_buff+curr_slot_offset);
    printf("free Slot is %d\n", free_slot);
    printf("Slot offset is %d\n", curr_slot_offset);

    PF_UnfixPage(tbl->fd, tbl->curr_page, TRUE);
    *rid = tbl->numSlots+(tbl->curr_page<<16);
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

    int fd = tbl -> fd;
    char **buffer = malloc(sizeof(char*));
    int *pageNo = malloc(sizeof(int));
    //to store page obtained
    int getPage = PF_GetFirstPage(fd, pageNo, buffer);
    while(getPage >= 0){
        int slots = getNumSlots(*buffer);
        printf("Number of slots in page %d is %d\n", *pageNo, slots);
        //for each record, do callback function
        for(int i = 1; i <= slots; i++){
            //get offset for that i
            int offset = getNthSlotOffset(i,*buffer);
            int recordLen = getLen(i,*buffer);
            printf("Record length is %d\n", recordLen);
            int rid = ((*pageNo) << 16) + i-1;
            char record[PF_PAGE_SIZE];
            memcpy(record,*buffer + offset, recordLen); //store in record array
            // printf("%s\n", record);
            callbackfn(callbackObj, rid, record, recordLen);
        }
        PF_UnfixPage(fd,*pageNo,TRUE);
        getPage = PF_GetNextPage(fd,pageNo,buffer);
    }

}

void setNumSlots(char* buff, int numSlots){
    *(short*)(buff + 2) = numSlots;
}

int getNumSlots(char* buff){
    short numSlots = *(short*)(buff + 2);
    return numSlots;
}

