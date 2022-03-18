from pyspark.sql import SparkSession
# from pyspark.sql.functions import col,array_contains
import re
from pyspark.sql.functions import split, regexp_extract, col
# from pyspark.sql import functions as F

def print_line():
    print("-"*80)

'''
    Code for Part B
'''
spark = SparkSession.builder.appName("PartB").getOrCreate()
print_line()

'''
    Task A
'''
log_data = spark.read.text("access.log")
log_data.show(5)
print_line()

'''
    Task B
'''
def regex(x):
    # Gets the host IP address from the log file
    host = r'(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|-)'
    # regex to match garbage hyphens
    garbage = r' [^\s]+ [^\s]+ ' 
    # regex to match the date
    timestamp =  r'(\[([0-9]{2}/[A-Za-z]{3}/[0-9]{4}:[0-9]{2}:[0-9]{2}:[0-9]{2} [-+][0-9]{4})\]|-)'
    # regex to match the request
    requests = r'\s(\"(GET|POST|PUT|HEAD|DELETE|PATCH|OPTIONS|CONNECT|PROPFIND)\s(.*)\"|-)' 
    # Possible request codes
    codes = r'\s(101|200|201|202|203|204|205|206|300|301|302|303|304|305|307|400|401|402|403|404|405|406|407|408|409|410|411|412|413|414|415|416|417|499|500|501|502|503|504|505|-)\s' #these are the possible response codes, googled that even 499 is possible
    # regex to match the size of the response
    reslen = r'(\d+|-)\s' 
    p = re.search(host + garbage + timestamp + requests + codes + reslen, x)
    if(p is None):
        return (None, None, None, None, None)
    elif(p.group(1) == "-" or p.group(2) == "-" or p.group(4) == "-" or p.group(7) == "-" or p.group(8) == "-"):
        return (None, None, None, None, None)
    else:
        return (p.group(1), p.group(2), p.group(4) ,p.group(7), p.group(8))
    
temp_rdd = log_data.rdd.map(lambda x: regex(x['value']))
df = temp_rdd.toDF(['Host', 'Timestamp', 'Method', 'Code', 'Length'])
print("Number of bad Rows :", df.filter("Host is null").count())
final_df = df.na.drop()
print("Number of good Rows :",final_df.count())
spark.stop()