def get_text():
    input_text = input("Paste text: ")
    return input_text

def add_newlines(text):
    text_list = text.split()
    output = ""
    count = 0
    print("||||||||||||||||||||||||||")
    for word in text_list:
        output += word + " "
        count += 1
        if not count % 10:
            print(output[:-1])
            output = ""
    print(output[:-1])
    return output

if __name__ == "__main__":
    text = get_text()
    mod_text = add_newlines(text)
