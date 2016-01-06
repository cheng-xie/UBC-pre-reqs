from urllib.request import urlopen
from bs4 import BeautifulSoup

domain = 'https://courses.students.ubc.ca'
url = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=1&dept=CPSC' # write the url here

# open socket to webpage
usock = urlopen(url)
# grab the html
data = usock.read()
usock.close()

# parse the data with beautiful soup
soup = BeautifulSoup(str(data), 'html.parser')

course_links = []

# find all course links on the department page
for course in soup.find_all('td'):
    course_soup = BeautifulSoup(str(course), 'html.parser')
    for link in course_soup.find_all('a'):
        s = str(link.get('href'))
        if '&course=' in s:
            # print(s)
            course_links.append(s)

print(str(len(course_links)))


# loop over course links finding 
for i in range(0, len(course_links)):
    course_url = domain + course_links[i]

    usock = urlopen(course_url)
    course_data = usock.read()
    usock.close()

    course_soup = BeautifulSoup(str(course_data), 'html.parser')

    # course header
    print(course_soup.find('h4').get_text())
    # course info
    print(course_soup.find('p').get_text())

    for p in course_soup.find_all('p'):
        if 'Pre-req' in str(p):
            print(p.get_text())
            for prereq in p.find_all('a'):
                print(prereq.get('href'))
                print(prereq.get_text())

    print('\n' + str(i) + '\n')
