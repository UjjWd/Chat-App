class Solution {
public:
    int toposort(queue<int> &q, vector<vector<int>>&g,vector<int>&degree,vector<int>& coins, bool removeleaf)
    {
        int u=0,impNodes=0,level=0;
        while(!q.empty())
        {
            int size=q.size();
            while(size--)
            {
                u=q.front();
                q.pop();
                for(auto &v:g[u])
                {
                    degree[v]--;
                    if(removeleaf && coins[v])
                       continue;
                    if(degree[v]==1)
                    {
                        q.push(v);
                        if(level>=1)    // Only counting node which are not leaf and not a parent of leaf (Can be collected from distance of 2)
                           impNodes++;
                    }   
                }
            }
            level++;
        }
        return max(0,(impNodes-1)*2);
    }
    int collectTheCoins(vector<int>& coins, vector<vector<int>>& edges) 
    {
        int n=coins.size();
        vector<int>degree(n,0);
        vector<vector<int>>g(n);
        queue<int>leafNoCoin,leafWithCoin;
        for(auto &e:edges)
        {
            degree[e[0]]++;
            degree[e[1]]++;
            g[e[0]].push_back(e[1]);
            g[e[1]].push_back(e[0]);
        }
        for(int i=0;i<n;i++)
        {
            if(!coins[i] && degree[i]==1)
               leafNoCoin.push(i); 
        }
        // First remove leafs with No Coins
        toposort(leafNoCoin,g,degree,coins,true);
        for(int i=0;i<n;i++)
        {
            if(coins[i] && degree[i]==1) 
               leafWithCoin.push(i);  
        }
        // Now return thr cost
        return toposort(leafWithCoin,g,degree,coins,false);
    }
};