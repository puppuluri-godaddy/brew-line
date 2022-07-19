import heapq

def findMatch(json_input):

    currentDB = fetchDB()   # a dictionary with Key as Hobbies and Value as list of User's (who like that hobby)

    current_user, current_interests = json_input['user'], json_input['interests']

    matchDB = dict()

    for interest in current_interests:

        if not currentDB.get(interest, 0):
            
            currentDB[interest] = [current_user]

        else:

            #loop throught interest's values
            for user in currentDB[interest]:

                matchDB[user] = matchDB.get(user, 0) + 1

            currentDB[interest].append(current_user)


    # matchDB now has the user-match count
    # using matchDB to return top N matches

    similar_users = []
    top_matches = 5

    for user in matchDB:

        if len(similar_users) < top_matches:

            heapq.heappush(similar_users, (-matchDB[user], user))

        else:

            if -1*similar_users[-1][0]<matchDB[user]:

                heapq.heappop(similar_users)

                heapq.heappush(similar_users, (-matchDB[user], user))

    most_similar_users = []

    for match_score, user in similar_users:

        most_similar_users.append(user)

    return {"Output" : most_similar_users}

