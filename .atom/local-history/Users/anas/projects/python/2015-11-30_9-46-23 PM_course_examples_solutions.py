def max(a, b):
    if (int(a) > int(b)):
        return a
    elif (int(a) < int(b)):
        return b
    else:
        return 'They are equal'

print('max(3, 5) is : ' + str(max(3, 5)))


def max_of_three(a, b, c):
    if (a > b and a > c):
        return a
    elif (b > a and b > c):
        return b
    else:
        return c

print('max_of_three 4, 6, 8 is: ' + str(max_of_three(4, 6, 8)))


def get_length(s):
    ln = 0
    for i in s:
        ln += 1
    return ln

print('length of (bla bla) is ' + str(get_length('bla bla')))

def