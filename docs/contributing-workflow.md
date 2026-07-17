# Contributing Workflow

Make sure you're on main and pull the latest changes
``` bash
git checkout main
git pull origin main
```

Create a new feature branch
``` bash
git checkout -b docs/add-readme
```

Make your changes to the code...

Commit your changes
``` bash
git add .
git commit -m "adding setup steps to readme"
git push -u origin docs/add-readme
```

Then go to Github and open the pull request to be reviewed and merged by a teammate.