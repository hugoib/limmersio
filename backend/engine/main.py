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

def limmersify(args):
    text = text_cleaning(args.text) 
    phrases = extract_nouns_and_phrases(text)
    word_dict = create_word_label_dic()
    print(args)

def text_cleaning(args):
    txt = args.lower()
    txt = re.sub(r'[\(\)\"#\/@;:\'<>\{\}\=~|\.\?]', '', txt)
    return txt

def extract_nouns_and_phrases(args):
    blob = TextBlob(args)
    phrases = list(blob.noun_phrases)
    phrases = [i for i in phrases if len(i)>8]
    print('Extracted phrases:', phrases)
    translator = Translator()
    translated_phrases = [translator.translate(w, src='en', dest='de').text for w in phrases]
    print('Translated phrases:', translated_phrases)
    print('*********************************************************************')
    return phrases

def create_word_label_dic():
    #create word-label dictionary
    df = pd.read_csv('./data/en_50k.csv', sep = ',', encoding= 'utf8')
    print('word frequency dataset:',df.head())
    label = [0]*10000+[1]*20000+[2]*20000
    df['label'] = label
    print('words with hard level:', df.head())
    return word_dict = dict(zip(df.word, df.label))
