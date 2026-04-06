
create or replace function public.validate_sleep_log_quality()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.quality < 1 or new.quality > 5 then
    raise exception 'quality must be between 1 and 5';
  end if;
  return new;
end;
$$;
