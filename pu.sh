if [ "$1" = "deploy" ] 
then
	git add .
        git commit -a -m "tidying commits"
        git push origin development
	git checkout master
        git merge --no-ff development "merging"
        git push origin master
        git checkout development
else
	git add .
	git commit -a -m "$*"
	git push origin development
fi