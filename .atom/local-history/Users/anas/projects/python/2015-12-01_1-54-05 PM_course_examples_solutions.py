# excercise 1
def max(a, b):
    if (int(a) > int(b)):
        return a
    elif (int(a) < int(b)):
        return b
    else:
        return 'They are equal'

print('max(3, 5) is : ' + str(max(3, 5)))


# Excercise 2
def max_of_three(a, b, c):
    if (a > b and a > c):
        return a
    elif (b > a and b > c):
        return b
    else:
        return c

print('max_of_three 4, 6, 8 is: ' + str(max_of_three(4, 6, 8)))


# Excercise 3
def get_length(s):
    ln = 0
    for i in s:
        ln += 1
    return ln

print('length of (bla bla) is ' + str(get_length('bla bla')))


# Excercise 4
def is_it_avowel(s):

    if (s == 'a' or s == 'i' or s == 'e' or s == 'o' or s == 'y'):
        return True
    else:
        return False

print ('is_it_avowel(a) ' + str(is_it_avowel('a')))
print ('is_it_avowel(d) ' + str(is_it_avowel('d')))


def is_it_avowel2(s):
    vowels = ['a', 'e', 'i', 'o', 'y']
    for i in vowels:
        if (i == s):
            return True
    return False

print ('is_it_avowel2(a) ' + str(is_it_avowel2('a')))
print ('is_it_avowel2(d) ' + str(is_it_avowel2('d')))


def translate(s):
    vowels = ['a', 'e', 'i', 'o', 'y']
    output = ''
    for i in s:
        status = 'constant'
        for j in vowels:
            if(i == j):
                status = 'vowel'
        if (status == 'constant'):
            output += i + 'o' + i
        else:
            output += i
    return output

print('translate(this is fun) : ' + translate('tis is fun'))
