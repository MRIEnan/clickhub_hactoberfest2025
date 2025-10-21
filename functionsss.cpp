#include <iostream>
using namespace std;

int factorial (int f);

int main()
{
    int f;
    cout <<"Enter the Positive number:";
    cin >> f;
    if (f<0){
        cout<<"Inavlid number";
    }
    else if (f==0){
        cout<<"beta aur koi number daalo";

    }
    else 
    cout<<"factorial of "<<f<<"="<< factorial(f);
    return 0;


}
int factorial (int f){
    if(f>1)
    return f*factorial(f-1);
    else 
    return 1;
}
