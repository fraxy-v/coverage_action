#include <iostream>

int method_in_shared_lib();
int method_in_static_lib();

int main() {
    std::cout << "Hello, World!" << std::endl;
    std::cout << "method_in_shared_lib() returned: " << method_in_shared_lib() << std::endl;
    std::cout << "method_in_static_lib() returned: " << method_in_static_lib() << std::endl;
    return 0;
}