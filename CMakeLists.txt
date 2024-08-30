project(coverage_action)


add_library(my_static_lib STATIC src/my_static_lib.cpp)
add_library(my_shared_lib SHARED src/my_shared_lib.cpp)


add_executable(main src/main.cpp)
target_link_libraries(main my_static_lib my_shared_lib)