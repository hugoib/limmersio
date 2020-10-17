import pandas as pd
import numpy as np
from textblob import TextBlob
import textwrap
from googletrans import Translator
import nltk
import random
import re
from nltk.collocations import *
#import timeit
import time

#start = timeit.default_timer()

#txt = 'But arriving all at once, they felt like something much bigger: a sign that the Wild Wild Web — the tech industry’s decade-long experiment in unregulated growth and laissez-faire platform governance — is coming to an end. In its place, a new culture is taking shape that is more accountable, more self-aware and less willfully naïve than the one that came before it.'
#txt =  "The Digital Tech Academy is our new program open only to outstanding digital talents from all FAU degree programs and faculties! We impart all you need to follow your heart and passion for digitization, entrepreneurship and innovation. Work in interdisciplinary teams, get in touch with expert coaches and mentors, and develop your own pristine and validated business model."
txt = "Coffee is a brewed drink prepared from roasted coffee beans, the seeds of berries from certain Coffea species. When coffee berries turn from green to bright red in color indicating ripeness they are picked, processed, and dried. Dried coffee seeds are roasted to varying degrees, depending on the desired flavor. Roasted beans are ground and then brewed with near-boiling water to produce the beverage known as coffee. Clinical research indicates that moderate coffee consumption is benign or mildly beneficial as a stimulant in healthy adults, with continuing research on whether long-term consumption reduces the risk of some diseases, although those long-term studies are generally of poor quality."


#read from txt file
#with open('data/coffee.txt', 'r') as myfile:
#  txt = myfile.read().replace('\n', '')


def wrap(string, max_width):
    return '\n'.join(textwrap.wrap(string, max_width))

print('Original text:', wrap(txt, max_width= 200))
print('*********************************************************************')

#text cleaning
txt = txt.lower()
txt = re.sub(r'[\(\)\"#\/@;:\'<>\{\}\=~|\.\?]', '', txt)
#lemmatizer = nltk.WordNetLemmatizer()
#stemmer = nltk.stem.porter.PorterStemmer()


#first extract all noun phrases
blob = TextBlob(txt)
phrases = list(blob.noun_phrases)
phrases = [i for i in phrases if len(i)>8]
print('Extracted phrases:', phrases)
translator = Translator()
translated_phrases = [translator.translate(w, src='en', dest='de').text for w in phrases]
print('Translated phrases:', translated_phrases)
print('*********************************************************************')


#then extract all nouns from the remaining corpus
for i in phrases:
    txt_rm_phrase = txt.replace(i, '')
is_noun = lambda pos: pos[:2] == 'NN'
tokenized = nltk.word_tokenize(txt_rm_phrase)
nouns = [word for (word, pos) in nltk.pos_tag(tokenized) if is_noun(pos)]
nouns = [i for i in nouns if len(i) >2] # to remove some special characters
print('Extracted nouns:', nouns)
translated_nouns = [translator.translate(w, src='en', dest='de').text for w in nouns]
print('Translated nouns:', translated_nouns)
print('*********************************************************************')

#create word-label dictionary
df = pd.read_csv('data/en_50k.csv', sep = ',', encoding= 'utf8')
print('word frequency dataset:',df.head())
label = [0]*10000+[1]*20000+[2]*20000
df['label'] = label
print('words with hard level:', df.head())
word_dict = dict(zip(df.word, df.label))


text = list(set(nouns) & set(df.word.to_list())) #make sure the extracted nouns are in the dataset
l = [word_dict[i] for i in text]
pairs = [(k, v) for (k, v) in zip(text, l)]

# find all three levels word list
levelA = []
levelB = []
levelC = []
for i in range(len(pairs)):
    if pairs[i][1] == 0:
        levelA.append(pairs[i][0])
    if pairs[i][1] == 1:
        levelB.append(pairs[i][0])
    if pairs[i][1] == 2:
        levelC.append(pairs[i][0])
print('Level A words:', levelA)
print('Level B words:', levelB)
print('Level C words:', levelC)
print('*********************************************************************')

#define ways to mark the replaced words
class color:
    RED = '\033[91m'
    END = '\033[0m'


def replace_all(text, dic):
    for i, j in dic.items():
        text = text.replace(i, j)
    return text




#select 15% percentage for level A user
article_length = len(nltk.word_tokenize(txt))
selected_A = random.choices(levelA, k=round(0.15 * article_length))

bold_A = []
for w in selected_A:
    temp = translator.translate(w, src='en', dest='de').text
    bold_A.append(color.RED + temp +color.END)

dictA= {k:v for k,v in zip(selected_A, bold_A)}
print('Final display for A user:', wrap(replace_all(txt, dictA), max_width=200))
print('*********************************************************************')





#select 30% percentage for level B user
if len(random.choices(text, k=round(0.3 * article_length))) < len(levelA):
    selected_B = random.choices(levelA, k=round(0.3*article_length))
else:
    selected_B = random.choices(levelA + levelB + phrases, k=round(0.15 * article_length))

bold_B = []
for w in selected_B:
    temp = translator.translate(w, src='en', dest='de').text
    bold_B.append(color.RED+temp+color.END)

dictB= {k:v for k,v in zip(selected_B, bold_B)}
print('Final display for B user:', wrap(replace_all(txt, dictB), max_width= 200))
print('*********************************************************************')




#add C level words for level C user
if len(random.choices(text, k=round(0.7 * article_length))) < len(levelA):
    selected_C = random.choices(levelA, k=round(0.3*article_length))
else:
    selected_C = random.choices(levelA + levelB + levelC + phrases, k=round(0.15 * article_length))

bold_C = []
for w in selected_C:
    temp = translator.translate(w, src='en', dest='de').text
    bold_C.append(color.RED + temp + color.END)

dictB = {k:v for k,v in zip(selected_C, bold_C)}
print('Final display for C user:', wrap(replace_all(txt, dictB), max_width=200))
print('*********************************************************************')





#stop = timeit.default_timer()
#print('Run time: ', stop - start)
