from pyspark.sql import SparkSession
from itertools import combinations
# from collections import Counter
# import numpy as np
# from pyspark.sql.functions import udf
# from pyspark.sql.types import StringType
# import org.apache.spark.sql.functions._

def toCSVLine(data):
  return ','.join(str(d) for d in data)

#instanciate a spark session object
spark = SparkSession.builder.appName("Q1").getOrCreate()
print("----------------------------------------------------------------------------------------------------------------------")
spark.sparkContext.setLogLevel("ERROR")
groceries = spark.sparkContext.textFile("groceries.csv")
# print(groceries.take(5))
pairs = groceries.map(lambda x: list(combinations(x.split(","), 2)))
# print(pairs.take(5))
# print("----------------------------------------------------------------------------------------------------------------------")
flatted_pairs = groceries.flatMap(lambda x: list(combinations(x.split(","), 2)))
flatted_pairs = flatted_pairs.map(lambda x: (x[0], x[1]) if x[0] < x[1] else (x[1], x[0]))
# print(flatted_pairs.take(5))
# print("----------------------------------------------------------------------------------------------------------------------")
count_each_pair = flatted_pairs.map(lambda x: (x, 1)).reduceByKey(lambda x, y: x + y )
count_each_pair = count_each_pair.sortBy(lambda x: x[1], ascending=False)

split_each_pair  = count_each_pair.map(lambda x: (x[0][0], x[0][1], x[1]))
print(split_each_pair.take(5))
print("----------------------------------------------------------------------------------------------------------------------")
df = split_each_pair.toDF()
df.toPandas().to_csv("count.csv", sep=',', header=['item1', 'item2', 'count'], index=False)
spark.stop()