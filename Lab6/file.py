import argparse
from unittest import result
from neo4j import GraphDatabase
import os

# Initialize the Parser
parser = argparse.ArgumentParser(description ='Process some integers.')
parser.add_argument('--data',
                    type=str,
                    help ='Path to data files')
args = parser.parse_args()


# driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "pandu@123"))
# session = driver.session()
# print(args.data)
# q1 = """
# call apoc.load.csv("/Users/hiteshkumar/Desktop/Courses/387/Lab6/lab6-data/tweets.csv")
# yield lineNo,map,list
# """
# result= session.run(q1).data()
# for record in result:
#     print(record)

dir_list = os.listdir(args.data)
 
# prints all files
# print(dir_list)

file_names = []
for file in dir_list:
    if file.endswith(".csv"):
        file_names.append(os.path.splitext(file)[0])
# print(file_names)

relational_files=['follows','sent','mentions','contains']
from_file=['users','users','tweets','tweets']
to_file=['users','tweets','users','hashtags']
node=['users','tweets','hashtags']
for file in node:
    # print(file)
    with open(args.data+'/'+file+'.csv', 'r') as f:
        header = next(f) # Skip the header row.
        header = header.strip('\n').split(',')
        # print(header[0])
        # session.run("COPY "+file+" FROM STDIN (FORMAT CSV)", f)
        if file in node:
            for row in f:
                # print(row.split(','))
                row= row.strip('\n').split(',', 1)
                temp_val=row[1].replace('"',"")
                cypher_command = f"CREATE (:{file} {{id: \'{row[0]}\', {header[1]}: \"{temp_val}\" }})"
                print(cypher_command)
for file in relational_files:
    # print(file)
    with open(args.data+'/'+file+'.csv', 'r') as f:
        header = next(f) # Skip the header row.
        header = header.strip('\n').split(',')
        # print(header[0])
        # session.run("COPY "+file+" FROM STDIN (FORMAT CSV)", f)
        for row in f:
            get_index  = relational_files.index(file)
            row= row.strip('\n').split(',', 1)
            cypher_command = f""" WITH true as pass 
            MATCH (a:{from_file[get_index]} {{id : \'{row[0]}\' }} ), (m:{to_file[get_index]} {{id : \'{row[1]}\' }})
             CREATE (a)-[:{file}]->(m)"""
            # cypher_command = f"""
            # MATCH (a:users {id: toInteger(from_file[get_index])}), (b:users {id: toInteger(to_file[get_index])})
            # CREATE (a)-[:FOLLOWS]->(b)
            # RETURN a, b
            # """
            print(cypher_command)
