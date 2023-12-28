import os

##############################
configuration_extensions = ['ts', 'scss']
configuration_ignores = ['out', 'node_modules']
##############################


def search(path, ignore):
    files = []

    for file in os.listdir(path):
        if file not in ignore:
            if os.path.isfile(path + "/" + file):
                files.append(path + "/" + file)

            elif os.path.isdir(path + "/" + file):
                files = files + search(path + "/" + file, ignore)

    return files


def readCodeLines(extensions, ignore):
    total_len = 0

    files = search("./", ignore)

    for file in files:
        if file.endswith(tuple(extensions)):
            with open(file, "r", encoding="utf-8") as fp:
                total_len += len(fp.readlines())

    return total_len


if __name__ == "__main__":
    ask_for_parameters = input("Do you want to use your previous options? ")

    if ask_for_parameters.lower() in ["no", "false", "0", "nah"]:
        question_1 = (
            "Please provide the file endings you wish to count (separate with commas): "
        )
        list_of_valid_extensions_string = input(question_1)

        valid_file_extensions = list_of_valid_extensions_string.replace(" ", "").split(
            ","
        )

        question_2 = (
            "Please provide the files/dirs you wish to ignore (separate with commas): "
        )
        list_of_files_and_dirs_to_ignore_string = input(question_2)

        file_and_dirs_to_ignore = list_of_files_and_dirs_to_ignore_string.replace(
            " ", ""
        ).split(",")

        with open(__file__, "r") as this_file:
            all_lines = this_file.readlines()

        all_lines[3] = "configuration_extensions = " + str(valid_file_extensions) + "\n"
        all_lines[4] = "configuration_ignores = " + str(file_and_dirs_to_ignore) + "\n"

        with open(__file__, "w") as this_file:
            this_file.writelines(all_lines)

        lines = readCodeLines(
            extensions=valid_file_extensions, ignore=file_and_dirs_to_ignore
        )
        print("You have " + str(lines) + " lines of code!")

    elif ask_for_parameters.lower() in ["yes", "true", "1", "yuh"]:
        lines = readCodeLines(
            extensions=configuration_extensions, ignore=configuration_ignores
        )
        print("You have " + str(lines) + " lines of code!")
