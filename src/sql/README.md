# SQL needed for Supabase

Some times you will need to run queries on the DB. Supabase does provide a query editor that you can do this in.

-   The Random stuff is just things that might be helpful
-   The triggers and functions need to be run in every new environment. The triggers will run automaticly, and the functions are called from the App. These were limited as much as possible.

## Random stuff

### Reset the id column

-   If you copy data between environments, you will have to reset the sequence for the table.
-   Run each seperately. XXXX is result from first command

```sql
select max(attendance_id)  + 1 from attendance
alter sequence attendance_attendance_id_seq restart with XXXXX
```

## Triggers

### Set updated_date on members trigger

```sql
create extension if not exists moddatetime schema extensions;

-- this trigger will set the "updated_at" column to the current timestamp for every update
create trigger
  handle_updated_at before update
on members
for each row execute
  procedure moddatetime(updated_at);
```

## Functions

### Get count of number of meetings from attendance

```sql
create or replace function number_of_meetings(startDate date, endDate date)
returns integer
language sql
as $$
  select count( DISTINCT meeting_date)
  from attendance
  where meeting_date >= startDate and meeting_date <= endDate;
$$;
```
