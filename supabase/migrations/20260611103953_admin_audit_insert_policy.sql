create policy "admin_audit_logs_admin_insert"
on public.admin_audit_logs
for insert
to authenticated
with check (public.is_admin());
