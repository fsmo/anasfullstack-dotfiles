# Buffer Overflows

There are three main ways of identifying flaws in applications.
  - If the source code of the application is available, then source code review is probably the easiest way to identify bugs.
  - If the application is closed source, you can use reverse engineering techniques, or fuzzing, to find bugs.

### Fuzzing

  - Fuzzing involves sending malformed data into application input and watching for unexpected crashes.
  - An unexpected crash indicates that the application might not filter certain input correctly. This could lead to discovering an exploitable vulnerability.
