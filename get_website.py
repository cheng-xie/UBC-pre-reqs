from urllib.request import urlopen
from bs4 import BeautifulSoup
from time import sleep
import re
import random

domain = 'https://courses.students.ubc.ca'
urls = ['https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=1&dept=CPSC',
        'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=1&dept=CPEN'] # write the url here
write_file = './graphical-site/data/DATA3.js'

def includeCriteria(name, link):
    number = int(name.split()[1])
    return number < 500

pages = []

for url in urls:
    # open socket to webpage
    usock = urlopen(url)
    # grab the html
    pages.append(usock.read())
    usock.close()

course_links = []
course_names = []
 
for data in pages:
    # parse the data with beautiful soup
    soup = BeautifulSoup(str(data), 'html.parser')
   
    # find all course links on the department page
    for course in soup.find_all('td'):
        course_soup = BeautifulSoup(str(course), 'html.parser')
        for link in course_soup.find_all('a'):
            # start a new jsession
            s = ''.join('?'.join(re.compile('jsessionid=[A-Z0-9]+\?').split(str(link.get('href')))))
            if '&course=' in s:
                course_links.append(s)
                name = link.get_text()
                course_names.append(name)

print(str(len(course_links)))

prereq_matrix = [[0]*len(course_links) for _ in range(0, len(course_links))] 

def getData(course_url):
    usock = urlopen(course_url)
    course_data = usock.read()
    usock.close()
    return course_data

# loop over course links finding 
for i in range(0, len(course_links)):
    sleep(0.5)
    course_url = domain + course_links[i]
    for _ in range(0, 10):   
        try:
            course_data = getData(course_url)
            break;
        except:
            sleep(1 + random.random())
            print(course_url)
            course_data = getData(course_url)

    course_soup = BeautifulSoup(str(course_data), 'html.parser')

    # course header
    course_header_text = course_soup.find('h4').get_text()
    course_header = course_header_text.split(' ')[0] + ' ' + course_header_text.split(' ')[1]
    print(course_header)

    # course info
    #print(course_soup.find('p').get_text())

    # find the pre-requisites
    for p in course_soup.find_all('p'):
        if 'Pre-req' in str(p):
            #print(p.get_text())
            for prereq in p.find_all('a'):
                # pre-req link
                prereq_link = prereq.get('href')
                prereq_name = prereq.get_text()
                try:
                    prereq_index = course_names.index(prereq_name) 
                    prereq_matrix[i][prereq_index]+=1
                    print(prereq_link)
                except:
                    print('Course not mapped' + prereq_name)

    print('\n' + str(i) + '\n')

print(prereq_matrix)

with open(write_file, 'w+') as output_file:
    start_pos = [[random.randint(100,500), random.randint(100,500)] for _ in range(0, len(course_names))]
    output = 'function DATA_TEST1(){{ this.matrix = {}; this.node_texts = {}; this.starting_positions = {} }}'.format(prereq_matrix, course_names, start_pos)
    output_file.write(output)
