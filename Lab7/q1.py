from pyspark.sql import SparkSession
from itertools import combinations
#instanciate a spark session object
spark = SparkSession.builder.appName("Q1").getOrCreate()
print("----------------------------------------------------------------------------------------------------------------------")
spark.sparkContext.setLogLevel("ERROR")
groceries = spark.sparkContext.textFile("groceries.csv")
# print(groceries.take(5))
pairs = groceries.map(lambda x: list(combinations(x.split(","), 2)))
print(pairs.take(5))
print("----------------------------------------------------------------------------------------------------------------------")
flatted_pairs = groceries.flatMap(lambda x: list(combinations(x.split(","), 2)))
print(flatted_pairs.take(5))
#stop the spark session
spark.stop()

