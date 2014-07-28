if [ "$1" = "deploy" ] 
then
	git checkout master
        git merge --no-ff development
        git push origin master
        git checkout development
else
	git add .
	git commit -a -m "$*"
	git clean -f
	git push origin development
fi