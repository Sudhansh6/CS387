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
    if (open_file < 0) {
        PF_PrintError();
        printf("Error in opening the file %s\n", dbname);
        return open_file;
    }
    printf("File is opened \n");

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
    int pagenum = 0;
    char* pageBuf;

    while(pagenum <= tbl->curr_page){
        int unfix = PF_UnfixPage(tbl->fd, pagenum, false);
        if (unfix < 0) {
            PF_PrintError();
            printf("Error in unfixing the page %d\n", pagenum);
            exit(EXIT_FAILURE);
        }

        int page_err = PF_GetNextPage(tbl->fd, &pagenum, &pageBuf);
        if(page_err < 0){
            PF_PrintError();
            printf("Error in getting the next page %d\n", pagenum);
            exit(EXIT_FAILURE);
        }
    }

    // Close the file
    int closefile = PF_CloseFile(tbl->fd);
    if (closefile < 0) {
        PF_PrintError();
        printf("Error in closing the file %s\n", tbl->dbname);
        exit(EXIT_FAILURE);
    }
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
//    int free_len=getFreelen(temp_buff);
    int free_len = getLen(tbl->numSlots, temp_buff);
    if(free_len<len){
        int new_page_err = PF_AllocPage(tbl->fd, &(tbl->curr_page), &temp_buff);
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
//    int free_slot = getFreeSlot(temp_buff);
    // Get the offset of the free slot
//    int free_slot_offset = getNthSlotOffset(free_slot, temp_buff);

    // if(tbl -> curr_page == -1){
    //     int pag_err = PF_AllocPage(tbl->fd, &tbl->curr_page, &temp_buff);
    //     printf("Page is allocated with page num %d\n", tbl->curr_page);
    //     if(pag_err < 0){
    //         PF_PrintError();
    //         printf("Error in Getting the page %d\n", tbl->curr_page);
    //         exit(EXIT_FAILURE);
    //     }
    //     tbl -> curr_page++;
    // }
    // printf("Allocated or Got the current page\n");
   
    // printf("Record is %d bytes\n", len);
    // printf("Record is %s\n", record);
    // int err = PF_GetFirstPage(tbl->fd, &tbl->curr_page, &temp_buff);
    // printf("Buffer is %d\n", temp_buff);
    // if(err < 0){
    //     PF_PrintError();
    //     printf("Error in getting the first page %d\n", tbl->curr_page);
    //     exit(EXIT_FAILURE);
    // }

    // int curr_slots = getNumSlots(temp_buff);

    // int out1 = DecodeInt(temp_buff);
    // printf("Decoded int is %d\n", out1);
    // int out2 = getNumSlots(temp_buff);
    // printf("Number of slots is  %d\n", out2);

    // int curr_freeptr=out1;
    // //We need to allocate a slot with the given record
    // int new_freeptr=curr_freeptr-len;
    // //Allocate memory into the page
    // memcpy(temp_buff+new_freeptr, record, len);
    // //Update the slot information in the page header
    // setNumSlots(temp_buff, curr_slots+1);
    // //Update the free pointer in the page header
    // EncodeInt(new_freeptr, temp_buff);
    // //Update the slot information in the slot
    // int curr_sltptr=4+4+curr_slots*4;
    // EncodeInt(new_freeptr, temp_buff+curr_sltptr);
    //Update the free pointer in the slot

    // int free_space=0;
    // printf("Free space is %d\n", free_space);
    // int new_page = 0;
    // if(free_space < len){
    //     int alloc_err = PF_AllocPage(tbl->fd, &new_page,&temp_buff);
    //     printf("Page is allocated with page num %d\n", new_page);
    //     if(alloc_err < 0){
    //         PF_PrintError();
    //         printf("Error: Could not allocate page %d\n", new_page);
    //         exit(EXIT_FAILURE);
    //     }
    //     PF_UnfixPage(tbl->fd, tbl->curr_page, TRUE);
    //     tbl->curr_page = new_page;
    //     PF_GetThisPage(tbl->fd, tbl->curr_page,&temp_buff);
    // }

    // Get the next free slot on page, and copy record in the free
    // TODO: Check if the record is too big
    int slot = getNumSlots(temp_buff);
//    int offset = getNthSlotOffset(slot, temp_buff);
//    int new_offset = offset + len;
//    setNumSlots(temp_buff, slot+1);
//    setLen(0, temp_buff, new_offset);
//    memcpy(temp_buff + offset, record, len);
    PF_UnfixPage(tbl->fd, tbl->curr_page, TRUE);
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
            callbackfn(callbackObj, (pageNum << 16) | slot, temp_buff + offset, len);
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

int getNthSlotOffset(int slot, char* buff){
//    printf("Getting the offset of slot %d\n", slot);
    int numSlots = getNumSlots(buff);
    int offset = getLen(0, buff);
    int i;
    for(i = 0; i < slot; i++){
        offset += getLen(i, buff);
    }
    return offset;
}

int getLen(int slot, char* buff){
    int offset = getNthSlotOffset(slot, buff);
//    printf("Offset is %d\n", offset);
    int len = *(int*)(buff + offset);
//    printf("Len is %d\n", len);
    return len;
}