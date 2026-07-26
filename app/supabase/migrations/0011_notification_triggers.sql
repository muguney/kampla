-- Kamp.la — Faz 7: bildirim tetikleyicileri (PRD 5.Q, 5.M, 6.11)
-- Admin paneli (Faz 8) henüz yok; bu yüzden "admin aksiyonu" bildirimleri
-- şimdilik doğrudan DB tetikleyicileriyle (locations/reports status değişimi)
-- otomatik oluşturuluyor. Fonksiyonlar `security definer` ile RLS'i bypass
-- eder (bkz. 0008_notifications.sql — normal kullanıcı/insert yalnızca admin'e
-- açık, bu yüzden sunucu tarafı bir mekanizma gerekiyordu). Faz 8'de gerçek
-- admin panel akışı devreye girdiğinde bu tetikleyiciler aynen kalabilir
-- (admin panel de aynı `update ... set status = ...` yolunu kullanacağı için).

-- --------------------------------------------------------------------------
-- locations.status: 'pending' -> 'published' | 'rejected'
-- --------------------------------------------------------------------------
create or replace function public.notify_on_location_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- created_by NULL olabilir (admin/import kaynaklı kayıtlar, on delete set null) — bildirilecek kimse yok.
  if NEW.created_by is null then
    return NEW;
  end if;

  if NEW.status = 'published' then
    insert into public.notifications (recipient_id, type, content, related_location_id)
    values (
      NEW.created_by,
      'location_approved',
      format('Eklediğiniz ''%s'' konumu onaylandı.', NEW.name),
      NEW.id
    );
  elsif NEW.status = 'rejected' then
    insert into public.notifications (recipient_id, type, content, related_location_id)
    values (
      NEW.created_by,
      'location_rejected',
      case
        when NEW.rejection_reason is not null and btrim(NEW.rejection_reason) <> ''
          then format('Eklediğiniz ''%s'' konumu reddedildi. Sebep: %s', NEW.name, NEW.rejection_reason)
        else format('Eklediğiniz ''%s'' konumu reddedildi.', NEW.name)
      end,
      NEW.id
    );
  end if;

  return NEW;
end;
$$;

create trigger locations_notify_status_change
  after update on public.locations
  for each row
  when (OLD.status is distinct from NEW.status)
  execute function public.notify_on_location_status_change();

-- --------------------------------------------------------------------------
-- reports.status: 'open' -> 'reviewing' -> 'resolved'
-- `reports` tablosunda konum adı tutulmuyor (yalnızca `location_id` FK var —
-- bkz. 0007_reports.sql), bu yüzden bildirim içeriği için `locations.name`
-- burada ayrıca sorgulanıyor.
-- --------------------------------------------------------------------------
create or replace function public.notify_on_report_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_location_name text;
  v_status_label text;
begin
  -- reporter_id NULL olabilir (kullanıcı hesabı silinmiş, on delete set null) — bildirilecek kimse yok.
  if NEW.reporter_id is null then
    return NEW;
  end if;

  select name into v_location_name from public.locations where id = NEW.location_id;

  v_status_label := case NEW.status
    when 'reviewing' then 'inceleniyor'
    when 'resolved' then 'çözüldü'
    else NEW.status
  end;

  insert into public.notifications (recipient_id, type, content, related_report_id, related_location_id)
  values (
    NEW.reporter_id,
    'report_status_changed',
    format(
      '''%s'' konumu için gönderdiğiniz hata bildiriminin durumu güncellendi: %s.',
      coalesce(v_location_name, 'İlgili'),
      v_status_label
    ),
    NEW.id,
    NEW.location_id
  );

  return NEW;
end;
$$;

create trigger reports_notify_status_change
  after update on public.reports
  for each row
  when (OLD.status is distinct from NEW.status)
  execute function public.notify_on_report_status_change();
