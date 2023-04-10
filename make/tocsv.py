import pandas as pd

df = pd.read_csv(r'C:\Users\Artience-0047\Desktop\ing\code\make\archive\raw_script_urls.tsv', delimiter='\t')
df.to_csv('data.csv', index=False)
