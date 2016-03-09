from urllib.request import urlopen
from bs4 import BeautifulSoup
from time import sleep

domain = 'https://courses.students.ubc.ca'
url = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=1&dept=CPSC' # write the url here
write_file = './data/DATA1.txt'

# open socket to webpage
usock = urlopen(url)
# grab the html
data = usock.read()
usock.close()

# parse the data with beautiful soup
soup = BeautifulSoup(str(data), 'html.parser')

course_links = []
course_names = []
# find all course links on the department page
for course in soup.find_all('td'):
    course_soup = BeautifulSoup(str(course), 'html.parser')
    for link in course_soup.find_all('a'):
        s = str(link.get('href'))
        if '&course=' in s:
            print(s)
            course_links.append(s)
            name = link.get_text()
            print(name)
            course_names.append(name)

print(str(len(course_links)))

prereq_matrix = [[0]*len(course_links) for _ in range(0, len(course_links))]

# loop over course links finding 
for i in range(0, len(course_links)):
    sleep(1)
    course_url = domain + course_links[i]

    usock = urlopen(course_url)
    course_data = usock.read()
    usock.close()

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
#with open(write_file, 'w') as output_file:
#    output_file.write()
