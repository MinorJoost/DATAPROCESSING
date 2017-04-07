#!/usr/bin/env python
# Name: Joost Kooijman
# Student number: 10760768
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''

import os
import csv
from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # create empty array to save list of arrays
    tv_series = []

    # loop over certain classes containing info
    for item in dom.body.by_class("lister-item mode-advanced"):
        raw_text = item

        # search for title by tagname
        title = raw_text.get_elements_by_tagname("a")[1].content.encode('utf8')

        # search for rating by tagname strong
        rating = raw_text.get_elements_by_tagname("strong")[0].content.encode('utf8')

        # search for genre and clean the string
        genre = str(raw_text.get_elements_by_classname("genre")[0].content.encode('utf8'))

        # cleans leading blank line
        # http://stackoverflow.com/questions/1140958/whats-a-quick-one-liner-to-remove-empty-lines-from-a-python-string
        genre = os.linesep.join([s for s in genre.splitlines() if s])

        # clean following blanks
        genre = genre.strip()

        # get runtime and clean "min"
        runtime = raw_text.get_elements_by_classname("runtime")[0].content.encode('utf8')
        runtime = runtime[:-3]

        # chunk of html containing actors
        actors_raw = raw_text.get_elements_by_tagname("p")[2]

        # calculate amount of actors
        actor_amnt = len(actors_raw.get_elements_by_tagname("a"))

        # creating array of actors
        actors = []
        for i in range(actor_amnt):
            actors.append(actors_raw.get_elements_by_tagname("a")[i].content.encode('utf8'))

        # concatenating all actors into 1 index
        actors = ', '.join(actors)

        # extending data
        tv_series.extend([[title, rating, genre, actors, runtime]])

    return tv_series


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # print all rows in csv
    for i in range(len(tvseries)):
        writer.writerow(tvseries[i])

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)