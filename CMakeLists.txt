cmake_minimum_required(VERSION 3.22)

project(coverage_action)
include(CTest)

add_library(my_static_lib STATIC src/my_static_lib.cpp)
add_library(my_shared_lib SHARED src/my_shared_lib.cpp)


if (BUILD_TESTING)
    enable_testing()
    include(coverage.cmake)
    add_executable(test_shared_lib src/test1.cpp)
    target_link_libraries(test_shared_lib my_shared_lib)

    add_executable(test_static_lib src/test2.cpp)
    target_link_libraries(test_static_lib my_static_lib)

    add_test(NAME test_shared_lib COMMAND test_shared_lib)
    add_test(NAME test_static_lib COMMAND test_static_lib)
endif()


add_executable(main src/main.cpp)
target_link_libraries(main my_static_lib my_shared_lib)