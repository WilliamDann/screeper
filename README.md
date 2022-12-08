# Another Screeps Bot
This is a bot to play the programming MMORTS [Screeps](https://screeps.com/). I never finish these projects - but I am going to try! 

## Setup
1. `npm install` to install dependancies.
2. Make a `.screeps.json` file in the project directory containing your information. If you have code in the default branch remember to set it to the one you want. 
```json
{
    "username": "[YOUR_USERNAME]",
    "token": "[YOUR_TOKEN]",
    "branch": "default",
    "ptr": false
}
```
3. `npm run push` to push the project. If you just want to build there is an `npm run build` as well, but push builds before running the gruntfile. 