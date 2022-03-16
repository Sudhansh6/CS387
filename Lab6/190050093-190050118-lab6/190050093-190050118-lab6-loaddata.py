import os
import sys

data_path     = 'lab6-data' 
dir_list = os.listdir(data_path)
original_stdout = sys.stdout
output_file = "script.cypher"

with open(output_file, 'w') as f: 
    sys.stdout = f 

    file_names = []
    for file in dir_list:
        if file.endswith(".csv"):
            file_names.append(os.path.splitext(file)[0])

    relational_files    = ['Follows', 'Sent', 'Mentions', 'Contains']
    node_files          = ['users', 'tweets', 'hashtags']
    from_file           = ['User', 'User', 'Tweet', 'Tweet']
    to_file             = ['User', 'Tweet', 'User', 'Hashtag']
    from_property       = ['name', 'name', 'text', 'text']
    to_property         = ['name', 'text', 'name', 'tag']
    from_index          = [0, 0, 1, 1]
    to_index            = [0, 1, 0, 2]
    node                = ['User', 'Tweet', 'Hashtag']
    property	        = ['name', 'text', 'tag']
    data = [[], [], []]

    for i in range(len(node_files)):
        file = node_files[i]
        with open(data_path + '/' + file + '.csv', 'r') as f:
            header = next(f) # Skip the header row.
            header = header.strip('\n').split(',')
           
            for row in f:
                row = row.strip('\n').split(',', 1)
                temp_val = row[1].replace('"','\\"')
                cypher_command = f"CREATE (:{node[i]} {{{property[i]}: \"{temp_val}\" }})"
                data[i].append(temp_val)
                print(cypher_command)
    print(";")

    for i in range(len(relational_files)):
        file = relational_files[i]
        with open(data_path + '/' + file + '.csv', 'r') as f:
            header = next(f) # Skip the header row.
            header = header.strip('\n').split(',')
           
            for row in f:
                row = row.strip('\n').split(',', 1)
                cypher_command = f""" 
                MATCH (a:{from_file[i]} {{{from_property[i]} : \"{data[from_index[i]][int(row[0]) - 1]}\" }} )
                MATCH (m:{to_file[i]} {{{to_property[i]} : \"{data[to_index[i]][int(row[1]) - 1]}\" }})
                CREATE (a)-[:{file}]->(m);"""
              
                print(cypher_command)

    sys.stdout = original_stdout
