// Hand-written types for the inv_* tables. Keep in sync with supabase/migrations.

export type EventType = "private" | "business";
export type RegistrationStatus = "confirmed" | "cancelled";
export type RegistrationSource = "self" | "manual";

export type EventRow = {
  id: string;
  slug: string;
  title: string;
  event_type: EventType;
  description: string | null;
  date_time: string;
  venue_name: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  template_id: string;
  media_url: string | null;
  primary_color: string | null;
  gift_link_url: string | null;
  reminder_offset_hours: number;
  reminder_sent_at: string | null;
  rsvp_deadline: string | null;
  max_guests: number | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type EventInsert = Omit<EventRow, "id" | "created_at" | "updated_at" | "reminder_sent_at"> & {
  id?: string;
};
export type EventUpdate = Partial<EventInsert>;

export type RegistrationRow = {
  id: string;
  event_id: string;
  full_name: string;
  phone: string;
  email: string | null;
  guest_count: number;
  guest_names: string[];
  notes: string | null;
  status: RegistrationStatus;
  source: RegistrationSource;
  created_at: string;
  updated_at: string;
};

export type RegistrationInsert = Omit<RegistrationRow, "id" | "created_at" | "updated_at">;
export type RegistrationUpdate = Partial<RegistrationInsert>;

export type StaffRow = {
  user_id: string;
  email: string;
  display_name: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      inv_events: { Row: EventRow; Insert: EventInsert; Update: EventUpdate; Relationships: [] };
      inv_registrations: {
        Row: RegistrationRow;
        Insert: RegistrationInsert;
        Update: RegistrationUpdate;
        Relationships: [
          {
            foreignKeyName: "inv_registrations_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "inv_events";
            referencedColumns: ["id"];
          },
        ];
      };
      inv_staff: {
        Row: StaffRow;
        Insert: Omit<StaffRow, "created_at">;
        Update: Partial<Omit<StaffRow, "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      inv_is_staff: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      inv_event_type: EventType;
      inv_registration_status: RegistrationStatus;
      inv_registration_source: RegistrationSource;
    };
    CompositeTypes: Record<string, never>;
  };
};
