int method_in_shared_lib();

int main() {
     if (42 ==  method_in_shared_lib()) {
         return 0;
     } else {
         return 1;
     }
}