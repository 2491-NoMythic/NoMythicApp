# Summary of changes

## 2022-11-18

-   in admin attendance only return meetings that have happened, or today
-   on first login of a member they must link account - this is to get their auth_id
-   added link_member db function
-   in list of members don't return deleted members
-   change localstorage values to strings not json - not needed
-   attendance counts by event not date
-   don't include attendance for events not happened yet

## 2022-11-16

-   Calendar fully implemented
-   Events: add / update / delete
-   attendance is by event now not date
-   next 3 events show on welcome screen
-   logo spins when clicked
