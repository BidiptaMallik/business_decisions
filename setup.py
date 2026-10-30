from setuptools import find_packages,setup
from typing import List

def get_requirements(file_path:str)->List[str]:
    ''''
    This will return list of req
    '''
    requirement_list:List[str]=[]
    try:
        
        with open('requirements.txt','r') as file:
            lines=file.readlines()
            for line in lines:
                requirement=line.strip()
                if requirement and requirement != '-e .':
                    requirement_list.append(requirement)

    except FileNotFoundError:
        print("requirments.txt file not found")
        
        
        
    return requirement_list


setup(
    name='Strategical_business_decisions',
    version='0.0.1',
    author='Bidipta Mallik',
    author_email='bidiptamallik0@gmail.com',
    packages=find_packages(),
    install_requires=get_requirements('requirements.txt')

)