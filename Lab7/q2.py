from pyspark.sql import SparkSession
import re
import matplotlib.pyplot as plt
from pyspark.sql.functions import split, regexp_extract, col, rank, row_number
from pyspark.sql import functions as f
from pyspark.sql.types import IntegerType,StringType
from pyspark.sql.window import Window
from pyspark.sql import SQLContext
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
# log_data.show(5)
# print_line()

'''
    Task B
'''
def print_rdd(rdd,id1,id2,len):
    temp = rdd.collect()
    for i in range(len):
        x = temp[i][id1]
        y = temp[i][id2]
        print(x,y)
def print_rdd1(rdd,id1,len):
    temp = rdd.collect()
    for i in range(len):
        x = temp[i][id1]
        print(x)
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
# print("Number of good Rows :",final_df.count())

# Task-D
#Part-A: HTTP Status Analysis
print("HTTP status analysis:")
temp_df=final_df.groupBy("Code").count().sort("Code",ascending=True)
temp_df = temp_df.rdd.toDF(['satuts','count'])
temp = temp_df.collect()
print('status','count')
for i in range(len(temp)):
    x = temp[i]['satuts']
    y = temp[i]['count']
    print(x,y)
print_line()
#Part-B: HTTP Method Analysis
temp_df=final_df.groupBy("Code").count().sort("count",ascending=False)
temp_df = temp_df.rdd.toDF(['Code', 'Count'])
plt1 = plt.figure()
ax = plt1.add_axes([0,0,1,1])
ax.axis('equal')
col_counts = temp_df.select('Count').rdd.flatMap(lambda x: x).collect()
code_counts = temp_df.select('Code').rdd.flatMap(lambda x: x).collect()
ax.pie(col_counts,labels = code_counts,autopct='%1.1f%%', startangle=90)
# interactive(True)
# plt.show()
#Part-C: Frequent Hosts
print("Frequent Hosts:")
freq_df=final_df.groupBy("Host").count().sort("count",ascending=False)
freq_df = freq_df.rdd.toDF(['host', 'count'])
freq_count = freq_df.select("host").distinct().count()
print('host','count')
print_rdd(freq_df,'host','count',freq_df.count())
print_line()
#Part-D: Distinct Hosts
print("Unique Hosts:")
print(freq_count)
print_line()
# Part-E: Daily unique hosts
print("Unique hosts per day:")
uni_host = final_df.select('Host',regexp_extract('Timestamp',r'([0-9]{2}/[A-Za-z]{3}/[0-9]{4})',1).alias('Date')).distinct()
day_host = uni_host.groupBy("Date").agg({"Host":"count"}).sort("Date",ascending=True)
day_host = day_host.rdd.toDF(['date','hosts'])
print('day','hosts')
print_rdd(day_host,'date','hosts',day_host.count())
print_line()
#Part-F: Visualizing the Number of Unique Daily Hosts
plt2 = plt.figure()
col_date = day_host.select('date').rdd.flatMap(lambda x: x).collect() 
col_hosts = day_host.select('hosts').rdd.flatMap(lambda x: x).collect()
plt.plot(col_date,col_hosts)
plt.xlabel("Day")
plt.ylabel("Hosts Count") 
plt.title("No of unique hosts daily")
# plt2.show()
# print_line()
# Part-G: Failed HTTP Clients
print("Failed HTTP Clients:")
exp = r'[45]\d{2}'
failed_df = final_df.filter(final_df['Code'].rlike(exp))
failed_df = failed_df.select('Host','Code')
# failed_df.show(truncate=False)
uni_failed_df=failed_df.groupBy('Host').count().sort('count',ascending=False)
uni_failed_df = uni_failed_df.select('Host')
print_rdd1(uni_failed_df,'Host',5)
print_line()
# Part-H: Visualize the requests issued during each hour.
exp1 = r'[45]\d{2}'
time_exp = r'([0-9]{2}/[A-Za-z]{3}/[0-9]{4}):([0-9]{2})'
time_df = final_df.select('Code',regexp_extract('Timestamp',time_exp,1).alias('Day'),regexp_extract('Timestamp',time_exp,2).alias('Hour'))
failed_df1 = time_df.filter(time_df['Code'].rlike(exp1))
failed_time_df1 = failed_df1.groupBy('Day','Hour').count().sort(['Day','Hour'],ascending=[True,True])
time_df1 = time_df.groupBy('Day','Hour').count().sort(['Day','Hour'],ascending=[True,True])
exp2 = r'22/Jan/2019'
time_df2 = time_df1.filter(time_df1['Day'].rlike(exp2))
failed_time_df2 = failed_time_df1.filter(failed_time_df1['Day'].rlike(exp2))
# time_df2.show(25,truncate=False)
# failed_time_df2.show(25,truncate=False)
plt3 = plt.figure()
col_tot = time_df2.select('count').rdd.flatMap(lambda x: x).collect() 
col_fail = failed_time_df2.select('count').rdd.flatMap(lambda x: x).collect()
col_hour = time_df2.select('Hour').rdd.flatMap(lambda x: x).collect()
plt.plot(col_hour,col_tot,label='Total Requests',color='green')
plt.plot(col_hour,col_fail,label='Failed Requests',color='gold')
plt.legend(framealpha=1, frameon=True)
plt.show()
# print_line()
# Part-I: Active Hours
print("Active Hours:")
time_exp = r'([0-9]{2}/[A-Za-z]{3}/[0-9]{4}):([0-9]{2})'
time_df = final_df.select('Method',regexp_extract('Timestamp',time_exp,1).alias('Day'),regexp_extract('Timestamp',time_exp,2).alias('Hour'))
time_df = time_df.groupBy('Day','Hour').agg({"Hour":"count"}).sort(['Day','count(Hour)'],ascending=[False,False])
# time_df.show(truncate=False)
w3 = Window.partitionBy("Day").orderBy(col("count(Hour)").desc())
temp_time_df=time_df.withColumn("row",row_number().over(w3)).filter(col("row") == 1).drop("row")
temp_time_rdd = temp_time_df.select('Day','Hour').rdd.map(lambda x: (x['Day'],x['Hour']+":00"))
temp_time_rdd = temp_time_rdd.toDF(['day','hour'])
print('day','hour')
print_rdd(temp_time_rdd,'day','hour',temp_time_rdd.count())
print_line()
# Part-J: Response length statistics
print("Response Length Statistics:")
res_df = final_df.select('Length')
res_df = res_df.withColumn('Length',res_df.Length.cast(IntegerType()))
res_df_rdd = res_df.rdd
print("Minimum length ",res_df_rdd.min()[0])
print("Maximum length ",res_df.agg({'Length': 'max'}).collect()[0][0])
print("Average length ",res_df.agg({'Length': 'avg'}).collect()[0][0])
print_line()
