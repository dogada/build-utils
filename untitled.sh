#!/bin/bash
# wiranges=("kbp.wr4" "kbp.wr7" "kbp.wr2" "kbp.wr6" "kbp.wr8" "kbp.wr9")
# wirangesName=("wr.1015" "wr.1019" "wr.1010" "wr.1018" "wr.1020" "wr.1021")

# echo "time on pg: $(date "+%H:%M:%S")"
# for i in "${wiranges[@]}"
# do
#     echo "${wirangesName[i]}"
#     sshpass -p r%s5^aBr ssh root@$i echo "time on $i: $(date "+%H:%M:%S")"
# done

#sshpass -p r%s5^aBr ssh root@kbp.wr2 date on $i $(date "+%H:%M:%S")


# #!/bin/bash
# echo "time on kbp.pg: $(date "+%H:%M:%S")"
# wiranges=("kbp.wr4" "kbp.wr7" "kbp.wr2" "kbp.wr6" "kbp.wr8" "kbp.wr9")
# wirangesName=("wr.1015" "wr.1019" "wr.1010" "wr.1018" "wr.1020" "wr.1021")

# for ((i=0; i<${#wiranges[*]}; i++));
# do
#     sshpass -p r%s5^aBr ssh root@${wiranges[i]} echo "time on ${wiranges[i]} - ${wirangesName[i]}: $(date "+%H:%M:%S")"
# done


# #!/bin/bash
# echo "time on kbp.pg: $(date "+%H:%M:%S")"
# wiranges=("kbp.wr4" "kbp.wr7" "kbp.wr2" "kbp.wr6" "kbp.wr8" "kbp.wr9")
# wirangesName=("wr.1015" "wr.1019" "wr.1010" "wr.1018" "wr.1020" "wr.1021")

# for ((i=0; i<${#wiranges[*]}; i++));
# do
#     echo "top ps: ${wiranges[i]}"
#     sshpass -p r%s5^aBr ssh root@${wiranges[i]} ps aux | sort -nrk 3,3 | head -n 5
# done

#!/bin/bash
echo "time on kbp.pg: $(date "+%H:%M:%S")"
wiranges=("kbp.wr4" "kbp.wr7" "kbp.wr2" "kbp.wr6" "kbp.wr8" "kbp.wr9")
wirangesName=("wr.1015" "wr.1019" "wr.1010" "wr.1018" "wr.1020" "wr.1021")
wirangesAddresses=("10.0.2.12" "10.0.2.13" "10.0.2.17" "10.0.2.10" "10.0.2.14" "10.0.2.15")
for ((i=0; i<${#wiranges[*]}; i++));
do
    echo "ping: ${wiranges[i]}"
    ping -q -c 4 ${wirangesAddresses[i]}
done