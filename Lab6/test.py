print("LOAD CSV WITH HEADERS FROM 'file:///lab6-data/hashtags.csv' AS line CREATE (:hashtags {id: toInteger(line.id), hashtag: line.hashtag})")
