marked --gfm README.md | sed 's/\.md">/.html">/g' > README.html
#for i in `find -name '*.md' -not -path "./node_modules/*"`
for i in `find ./docs/ -name '*md'`
do
  out=`echo $i |sed "s/\.md/.html"/g`
  #out=`echo $out |sed -e "s/^\.//g"`
  echo $i '->' $out
  #echo "./_doc"$out
  #echo "./_doc"$out
  marked --gfm $i | sed 's/\.md">/.html">/g' > $out
done;
