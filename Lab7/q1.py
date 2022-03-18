from pyspark.sql import SparkSession
from itertools import combinations

# Instantiate a spark session object
spark = SparkSession.builder.appName("Q1").getOrCreate()
print("-"*50)

spark.sparkContext.setLogLevel("ERROR")
groceries = spark.sparkContext.textFile("groceries.csv")

pairs = groceries.map(lambda x: list(combinations(x.split(","), 2)))
print(pairs.take(5))
print("-"*50)

flatted_pairs = groceries.flatMap(lambda x: list(combinations(x.split(","), 2)))
print(flatted_pairs.take(15))

# Stop the spark session
spark.stop()

