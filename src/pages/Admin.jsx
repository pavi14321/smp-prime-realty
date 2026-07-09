import { useEffect, useState } from 'react';
import {
  PlusCircle, Trash2, Star, LayoutList, CheckCircle2, ClipboardList, Users, History,
  LogOut, ShieldAlert, Newspaper, CalendarClock, Send,
} from 'lucide-react';
import { getAllProperties, addProperty, deleteProperty, updateProperty, subscribeDB, CATEGORIES } from '../data/db';
import { getSubmissions, updateSubmissionStatus, subscribeSubmissions } from '../data/submissionsStore';
import { getAdmins, addAdmin, removeAdmin, getActivityLog, subscribeAdmins } from '../data/adminStore';
import {
  getAllBlogPostsAdmin, addBlogPost, updateBlogPost, deleteBlogPost, getEffectiveStatus, subscribeBlog,
} from '../data/blogStore';
import { useAdminAuth } from '../context/AdminAuthContext';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';

const emptyForm = {
  title: '', location: '', price: '', priceLabel: '', status: 'For Sale', category: 'Apartments',
  beds: '', baths: '', sqft: '', dimensions: '', parking: '', facing: 'North Facing',
  negotiable: false, readyToMove: true, featured: true, description: '', amenitiesText: '',
  images: [], lat: '12.9716', lng: '77.5946',
  genderPreference: 'Co-living',
  washingMachine: false,
  hotWater: false,
  washroomType: 'Attached',
  powerBackup: false,
  sharingOptions: [{ id: 1, sharingType: '2 Sharing', rooms: '', rent: '' }],
};

const emptyBlogForm = {
  title: '',
  description: '',
  image: [],
  publishMode: 'now', // 'now' | 'schedule'
  scheduleDate: '',
  scheduleTime: '',
};

export default function Admin() {
  const { currentAdmin, logout } = useAdminAuth();
  const isSuperAdmin = currentAdmin?.role === 'superadmin';

  const [tab, setTab] = useState('add');
  const [properties, setProperties] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [blogForm, setBlogForm] = useState(emptyBlogForm);
  const [lastAdded, setLastAdded] = useState(null);
  const [convertingId, setConvertingId] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', phone: '', password: '', role: 'admin' });

  useEffect(() => { const l = () => setProperties(getAllProperties()); l(); return subscribeDB(l); }, []);
  useEffect(() => { const l = () => setSubmissions(getSubmissions()); l(); return subscribeSubmissions(l); }, []);
  useEffect(() => { const l = () => setBlogPosts(getAllBlogPostsAdmin()); l(); return subscribeBlog(l); }, []);
  useEffect(() => {
    const l = () => { setAdmins(getAdmins()); setActivityLog(getActivityLog()); };
    l();
    return subscribeAdmins(l);
  }, []);

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const setBlog = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setBlogForm((f) => ({ ...f, [key]: val }));
  };

  const isPG = form.status === 'PG';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.images.length === 0) {
      toast.error('Please upload at least 1 photo');
      return;
    }

    let price, priceLabel, pg = null;
    const amenities = form.amenitiesText.split('\n').map((s) => s.trim()).filter(Boolean);

    if (isPG) {
      const validRows = form.sharingOptions.filter((r) => r.rooms && r.rent);
      if (validRows.length === 0) {
        toast.error('Please add at least one sharing type with rooms and rent');
        return;
      }
      const rents = validRows.map((r) => Number(r.rent));
      const min = Math.min(...rents);
      const max = Math.max(...rents);
      price = min;
      priceLabel = form.priceLabel || (min === max ? `₹${min.toLocaleString('en-IN')} / Month` : `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')} / Month`);
      pg = {
        genderPreference: form.genderPreference,
        washingMachine: form.washingMachine,
        hotWater: form.hotWater,
        washroomType: form.washroomType,
        powerBackup: form.powerBackup,
        parking: !!form.parking,
        sharingOptions: validRows,
      };
    } else {
      price = parseFloat(form.price) || 0;
      priceLabel = form.priceLabel || (form.status === 'For Rent' ? `₹${price.toLocaleString('en-IN')} / Month` : `₹${price.toLocaleString('en-IN')}`);
    }

    const newProperty = addProperty({
      title: form.title, location: form.location, price, priceLabel, status: form.status,
      category: isPG ? 'PG / Co-living' : form.category,
      beds: isPG ? 0 : parseInt(form.beds) || 0,
      baths: isPG ? 0 : parseInt(form.baths) || 0,
      sqft: parseInt(form.sqft) || 0, dimensions: form.dimensions, parking: form.parking,
      facing: form.facing, negotiable: form.negotiable, readyToMove: form.readyToMove,
      featured: form.featured, description: form.description, amenities, images: form.images,
      lat: form.lat, lng: form.lng, pg,
    });

    if (convertingId) {
      updateSubmissionStatus(convertingId, 'Converted');
      setConvertingId(null);
    }

    setLastAdded(newProperty);
    setForm(emptyForm);
    setTab('list');
  };

  const handleConvert = (s) => {
    setForm({
      ...emptyForm,
      title: s.propertyName,
      location: s.location,
      status: s.listingType === 'PG' ? 'PG' : s.listingType === 'Rent' ? 'For Rent' : 'For Sale',
      price: s.expectedAmount || '',
      sqft: s.sqft || '',
      readyToMove: s.constructionStatus === 'Ready to Move',
      images: s.images || [],
      genderPreference: s.genderPreference || 'Co-living',
      washingMachine: s.washingMachine || false,
      hotWater: s.hotWater || false,
      washroomType: s.washroomType || 'Attached',
      powerBackup: s.powerBackup || false,
      sharingOptions: s.sharingOptions?.length ? s.sharingOptions : emptyForm.sharingOptions,
      description:
        s.listingType === 'PG'
          ? `Submitted by owner ${s.ownerName} (${s.phone} / ${s.email}). Please review before publishing.`
          : `Condition: ${s.condition}. Submitted by owner ${s.ownerName} (${s.phone} / ${s.email}). Please review and complete remaining details before publishing.`,
    });
    setConvertingId(s.id);
    setTab('add');
  };

  const handleReject = (id) => updateSubmissionStatus(id, 'Rejected');

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.password || (!adminForm.email && !adminForm.phone)) {
      toast.error('Name, password, and at least one of email/phone are required');
      return;
    }
    addAdmin(adminForm);
    setAdminForm({ name: '', email: '', phone: '', password: '', role: 'admin' });
    toast.success('Admin added');
  };

  const handleRemoveAdmin = (id) => {
    try {
      removeAdmin(id);
      toast.success('Admin removed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleBlogSubmit = (e) => {
    e.preventDefault();
    if (!blogForm.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!blogForm.description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    if (blogForm.image.length === 0) {
      toast.error('Please upload a cover image');
      return;
    }

    let publishAt = Date.now();
    let status = 'Published';

    if (blogForm.publishMode === 'schedule') {
      if (!blogForm.scheduleDate || !blogForm.scheduleTime) {
        toast.error('Please pick a schedule date and time');
        return;
      }
      const scheduled = new Date(`${blogForm.scheduleDate}T${blogForm.scheduleTime}`).getTime();
      if (Number.isNaN(scheduled)) {
        toast.error('Invalid schedule date/time');
        return;
      }
      if (scheduled <= Date.now()) {
        toast.error('Scheduled time must be in the future');
        return;
      }
      publishAt = scheduled;
      status = 'Scheduled';
    }

    if (editingBlogId) {
      updateBlogPost(editingBlogId, {
        title: blogForm.title,
        description: blogForm.description,
        image: blogForm.image[0],
        publishAt,
        status,
      });
      toast.success('Blog post updated');
      setEditingBlogId(null);
    } else {
      addBlogPost({
        title: blogForm.title,
        description: blogForm.description,
        image: blogForm.image[0],
        author: currentAdmin?.name || 'Admin',
        publishAt,
        status,
      });
      toast.success(status === 'Scheduled' ? 'Blog post scheduled' : 'Blog post published');
    }

    setBlogForm(emptyBlogForm);
    setTab('blogList');
  };

  const handleEditBlogPost = (p) => {
    const d = new Date(p.publishAt);
    const pad = (n) => String(n).padStart(2, '0');
    setBlogForm({
      title: p.title,
      description: p.description,
      image: [p.image],
      publishMode: p.status === 'Scheduled' && getEffectiveStatus(p) === 'Scheduled' ? 'schedule' : 'now',
      scheduleDate: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      scheduleTime: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    });
    setEditingBlogId(p.id);
    setTab('blogAdd');
  };

  const handlePublishNow = (id) => {
    updateBlogPost(id, { status: 'Published', publishAt: Date.now() });
    toast.success('Post published now');
  };

  const handleDeleteBlogPost = (id) => {
    deleteBlogPost(id);
    toast.success('Post deleted');
  };

  const pendingCount = submissions.filter((s) => s.status === 'Pending').length;
  const scheduledBlogCount = blogPosts.filter((p) => getEffectiveStatus(p) === 'Scheduled').length;

  return (
    <div className="container-x py-10">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">Admin Panel</h1>
          <p className="text-sm text-gray-500">Add and manage property, PG and blog content shown on the website.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-brand-dark">{currentAdmin?.name}</p>
            <p className="text-xs text-gray-500">{isSuperAdmin ? 'Super Admin' : 'Admin'}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 border border-gray-200 rounded-md px-3 py-2">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div className="flex gap-2 bg-white border border-gray-200 rounded-lg p-1 mb-8 flex-wrap">
        <TabButton active={tab === 'add'} onClick={() => setTab('add')} icon={<PlusCircle size={15} />} label="Add Property / PG" />
        <TabButton active={tab === 'list'} onClick={() => setTab('list')} icon={<LayoutList size={15} />} label={`Manage (${properties.length})`} />
        <TabButton active={tab === 'submissions'} onClick={() => setTab('submissions')} icon={<ClipboardList size={15} />} label={`Requests (${pendingCount})`} />
        <TabButton
          active={tab === 'blogAdd'}
          onClick={() => { setEditingBlogId(null); setBlogForm(emptyBlogForm); setTab('blogAdd'); }}
          icon={<Newspaper size={15} />}
          label="Write Blog Post"
        />
        <TabButton active={tab === 'blogList'} onClick={() => setTab('blogList')} icon={<LayoutList size={15} />} label={`Manage Posts (${blogPosts.length})`} />
        {isSuperAdmin && (
          <>
            <TabButton active={tab === 'admins'} onClick={() => setTab('admins')} icon={<Users size={15} />} label="Manage Admins" />
            <TabButton active={tab === 'activity'} onClick={() => setTab('activity')} icon={<History size={15} />} label="Activity Log" />
          </>
        )}
      </div>

      {lastAdded && tab === 'list' && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6">
          <CheckCircle2 size={16} /> Listing added successfully with ID <strong>{lastAdded.id}</strong>. It now appears on the website.
        </div>
      )}

      {tab === 'add' && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 grid md:grid-cols-2 gap-5">
          {convertingId && (
            <div className="md:col-span-2 flex items-center gap-2 bg-brand-50 text-brand-dark text-sm rounded-lg px-4 py-3">
              <ShieldAlert size={16} /> Publishing from request <strong>{convertingId}</strong> — please complete the remaining fields below.
            </div>
          )}

          <Field label="Title" required>
            <input required value={form.title} onChange={set('title')} className="input" placeholder="e.g. Luxury 4BHK Villa / Green Nest PG" />
          </Field>
          <Field label="Location" required>
            <input required value={form.location} onChange={set('location')} className="input" placeholder="e.g. Sarjapur Road, Bengaluru" />
          </Field>

          <Field label="Status" required>
            <select value={form.status} onChange={set('status')} className="input">
              <option>For Sale</option><option>For Rent</option><option>New Launch</option><option>Plot</option><option>PG</option>
            </select>
          </Field>

          {!isPG && (
            <Field label="Category" required>
              <select value={form.category} onChange={set('category')} className="input">
                {CATEGORIES.map((c) => <option key={c.name}>{c.name}</option>)}
              </select>
            </Field>
          )}

          {!isPG && (
            <>
              <Field label="Price (₹)" required>
                <input required type="number" value={form.price} onChange={set('price')} className="input" placeholder="8500000" />
              </Field>
              <Field label="Custom Price Label (optional)">
                <input value={form.priceLabel} onChange={set('priceLabel')} className="input" placeholder="Auto-generated if left blank" />
              </Field>
              <Field label="Beds">
                <input type="number" value={form.beds} onChange={set('beds')} className="input" placeholder="0 for plots" />
              </Field>
              <Field label="Baths">
                <input type="number" value={form.baths} onChange={set('baths')} className="input" placeholder="0 for plots" />
              </Field>
            </>
          )}

          <Field label="Area (Sq.Ft)" required={!isPG}>
            <input required={!isPG} type="number" value={form.sqft} onChange={set('sqft')} className="input" placeholder="1650" />
          </Field>

          {!isPG && (
            <>
              <Field label="Plot Dimensions (optional)">
                <input value={form.dimensions} onChange={set('dimensions')} className="input" placeholder="e.g. 30x40" />
              </Field>
              <Field label="Facing">
                <select value={form.facing} onChange={set('facing')} className="input">
                  <option>North Facing</option><option>South Facing</option><option>East Facing</option><option>West Facing</option>
                </select>
              </Field>
            </>
          )}

          {isPG && (
            <>
              <Field label="Gender Preference" required>
                <select value={form.genderPreference} onChange={set('genderPreference')} className="input">
                  <option>Co-living</option>
                  <option>Men Only</option>
                  <option>Women Only</option>
                </select>
              </Field>
              <Field label="Washroom Type" required>
                <select value={form.washroomType} onChange={set('washroomType')} className="input">
                  <option>Attached</option>
                  <option>Common</option>
                </select>
              </Field>
              <div className="md:col-span-2 flex items-center gap-6 flex-wrap">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={form.washingMachine} onChange={set('washingMachine')} /> Washing Machine
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={form.hotWater} onChange={set('hotWater')} /> Hot Water
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={form.powerBackup} onChange={set('powerBackup')} /> Power Backup
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={form.parking} onChange={set('parking')} /> Parking
                </label>
              </div>
              <Field label="Sharing Type & Rent" full required>
                <SharingRows rows={form.sharingOptions} onChange={(rows) => setForm((f) => ({ ...f, sharingOptions: rows }))} />
              </Field>
            </>
          )}

          <Field label="Latitude (Bengaluru default)">
            <input value={form.lat} onChange={set('lat')} className="input" />
          </Field>
          <Field label="Longitude (Bengaluru default)">
            <input value={form.lng} onChange={set('lng')} className="input" />
          </Field>

          {!isPG && (
            <div className="md:col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.negotiable} onChange={set('negotiable')} /> Price Negotiable
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.readyToMove} onChange={set('readyToMove')} /> Ready To Move
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.featured} onChange={set('featured')} /> Show in Featured
              </label>
            </div>
          )}

          <Field label="Description" full>
            <textarea value={form.description} onChange={set('description')} rows={4} className="input" placeholder="Describe the listing..." />
          </Field>
          <Field label="Amenities (one per line)" full>
            <textarea value={form.amenitiesText} onChange={set('amenitiesText')} rows={3} className="input" placeholder={'Gated Community\n24/7 Security\nSwimming Pool'} />
          </Field>
          <Field label="Photos" full required>
            <ImageUploader images={form.images} onChange={(imgs) => setForm((f) => ({ ...f, images: imgs }))} max={6} label="Photos" />
          </Field>

          <div className="md:col-span-2">
            <button type="submit" className="btn-primary">{convertingId ? 'Publish Listing' : 'Add Listing'}</button>
          </div>
        </form>
      )}

      {tab === 'list' && (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-brand-dark text-left">
              <tr>
                <th className="px-4 py-3">ID</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Price</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Featured</th><th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.id}</td>
                  <td className="px-4 py-3 font-medium text-brand-dark">{p.title}</td>
                  <td className="px-4 py-3 text-gray-500">{p.location}</td>
                  <td className="px-4 py-3">{p.priceLabel}</td>
                  <td className="px-4 py-3"><span className="tag bg-brand-dark">{p.status}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => updateProperty(p.id, { featured: !p.featured })}>
                      <Star size={16} className={p.featured ? 'fill-gold text-gold' : 'text-gray-300'} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteProperty(p.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {properties.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No listings yet.</p>}
        </div>
      )}

      {tab === 'submissions' && (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-brand-dark text-left">
              <tr>
                <th className="px-4 py-3">Ref ID</th><th className="px-4 py-3">Owner</th><th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Title</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.id}</td>
                  <td className="px-4 py-3 font-medium text-brand-dark">{s.ownerName}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.phone}<br />{s.email}</td>
                  <td className="px-4 py-3">{s.propertyName}<br /><span className="text-xs text-gray-400">{s.location}</span></td>
                  <td className="px-4 py-3">{s.listingType}</td>
                  <td className="px-4 py-3">
                    <span className={`tag ${s.status === 'Pending' ? 'bg-gold-dark' : s.status === 'Converted' ? 'bg-brand-dark' : 'bg-sale'}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {s.status === 'Pending' && (
                      <>
                        <button onClick={() => handleConvert(s)} className="text-brand-dark underline text-xs mr-3">Convert to Listing</button>
                        <button onClick={() => handleReject(s.id)} className="text-red-500 underline text-xs">Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {submissions.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No requests yet.</p>}
        </div>
      )}

      {tab === 'blogAdd' && (
        <form onSubmit={handleBlogSubmit} className="bg-white border border-gray-100 rounded-xl p-6 grid md:grid-cols-2 gap-5">
          {editingBlogId && (
            <div className="md:col-span-2 flex items-center gap-2 bg-brand-50 text-brand-dark text-sm rounded-lg px-4 py-3">
              <ShieldAlert size={16} /> Editing post <strong>{editingBlogId}</strong>.
            </div>
          )}

          <Field label="Title" required full>
            <input required value={blogForm.title} onChange={setBlog('title')} className="input" placeholder="e.g. 5 Tips Before Buying Your First Home" />
          </Field>

          <Field label="Description" required full>
            <textarea
              required
              value={blogForm.description}
              onChange={setBlog('description')}
              rows={8}
              className="input"
              placeholder="Write your blog post content here..."
            />
          </Field>

          <Field label="Cover Image" required full>
            <ImageUploader images={blogForm.image} onChange={(imgs) => setBlogForm((f) => ({ ...f, image: imgs }))} max={1} label="Cover Image" />
          </Field>

          <Field label="Publish Option" required full>
            <div className="flex items-center gap-6 mb-3">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="radio"
                  name="publishMode"
                  checked={blogForm.publishMode === 'now'}
                  onChange={() => setBlogForm((f) => ({ ...f, publishMode: 'now' }))}
                />
                <Send size={14} /> Post Now
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="radio"
                  name="publishMode"
                  checked={blogForm.publishMode === 'schedule'}
                  onChange={() => setBlogForm((f) => ({ ...f, publishMode: 'schedule' }))}
                />
                <CalendarClock size={14} /> Schedule for Later
              </label>
            </div>

            {blogForm.publishMode === 'schedule' && (
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <input
                  type="date"
                  value={blogForm.scheduleDate}
                  onChange={setBlog('scheduleDate')}
                  className="input"
                />
                <input
                  type="time"
                  value={blogForm.scheduleTime}
                  onChange={setBlog('scheduleTime')}
                  className="input"
                />
              </div>
            )}
          </Field>

          <div className="md:col-span-2">
            <button type="submit" className="btn-primary">
              {blogForm.publishMode === 'schedule' ? 'Schedule Post' : editingBlogId ? 'Update Post' : 'Post Now'}
            </button>
          </div>
        </form>
      )}

      {tab === 'blogList' && (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-brand-dark text-left">
              <tr>
                <th className="px-4 py-3">Cover</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Publish Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.map((p) => {
                const effective = getEffectiveStatus(p);
                return (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <img src={p.image} alt={p.title} className="w-14 h-10 object-cover rounded-md" />
                    </td>
                    <td className="px-4 py-3 font-medium text-brand-dark max-w-xs truncate">{p.title}</td>
                    <td className="px-4 py-3 text-gray-500">{p.author}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(p.publishAt).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`tag ${effective === 'Published' ? 'bg-brand-dark' : 'bg-gold-dark'}`}>{effective}</span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {effective === 'Scheduled' && (
                        <button onClick={() => handlePublishNow(p.id)} className="text-brand-dark underline text-xs mr-3">
                          Publish Now
                        </button>
                      )}
                      <button onClick={() => handleEditBlogPost(p)} className="text-brand-dark underline text-xs mr-3">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteBlogPost(p.id)} className="text-red-500 hover:text-red-600 inline-flex align-middle">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {blogPosts.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No blog posts yet.</p>}
          {scheduledBlogCount > 0 && (
            <p className="text-xs text-gray-400 px-4 pb-4">{scheduledBlogCount} post(s) currently scheduled for a future date/time.</p>
          )}
        </div>
      )}

      {tab === 'admins' && isSuperAdmin && (
        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={handleAddAdmin} className="bg-white border border-gray-100 rounded-xl p-6 space-y-3 h-fit">
            <h3 className="font-display font-semibold text-brand-dark mb-2">Add Admin</h3>
            <input className="input" placeholder="Name" value={adminForm.name} onChange={(e) => setAdminForm((f) => ({ ...f, name: e.target.value }))} />
            <input className="input" placeholder="Email" value={adminForm.email} onChange={(e) => setAdminForm((f) => ({ ...f, email: e.target.value }))} />
            <input className="input" placeholder="Phone" value={adminForm.phone} onChange={(e) => setAdminForm((f) => ({ ...f, phone: e.target.value }))} />
            <input type="password" className="input" placeholder="Password" value={adminForm.password} onChange={(e) => setAdminForm((f) => ({ ...f, password: e.target.value }))} />
            <select className="input" value={adminForm.role} onChange={(e) => setAdminForm((f) => ({ ...f, role: e.target.value }))}>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
            <button className="btn-primary w-full">Add Admin</button>
          </form>

          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden h-fit">
            <table className="w-full text-sm">
              <thead className="bg-brand-50 text-brand-dark text-left">
                <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Role</th><th className="px-4 py-3"></th></tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-brand-dark">{a.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{a.email}<br />{a.phone}</td>
                    <td className="px-4 py-3"><span className="tag bg-brand-dark">{a.role === 'superadmin' ? 'Super Admin' : 'Admin'}</span></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleRemoveAdmin(a.id)} className="text-red-500 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'activity' && isSuperAdmin && (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-brand-dark text-left">
              <tr><th className="px-4 py-3">Admin</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Time</th></tr>
            </thead>
            <tbody>
              {activityLog.map((log) => (
                <tr key={log.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-brand-dark">{log.adminName}</td>
                  <td className="px-4 py-3">{log.role === 'superadmin' ? 'Super Admin' : 'Admin'}</td>
                  <td className="px-4 py-3">{log.action}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(log.timestamp).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {activityLog.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No activity yet.</p>}
        </div>
      )}
    </div>
  );
}

function SharingRows({ rows, onChange }) {
  const update = (id, key, value) => onChange(rows.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  const addRow = () => onChange([...rows, { id: Date.now(), sharingType: '2 Sharing', rooms: '', rent: '' }]);
  const removeRow = (id) => onChange(rows.filter((r) => r.id !== id));

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-gray-50 rounded-lg p-3">
          <select value={r.sharingType} onChange={(e) => update(r.id, 'sharingType', e.target.value)} className="input">
            <option>1 Sharing</option>
            <option>2 Sharing</option>
            <option>3 Sharing</option>
            <option>4 Sharing</option>
          </select>
          <input type="number" value={r.rooms} onChange={(e) => update(r.id, 'rooms', e.target.value)} className="input" placeholder="No. of rooms" />
          <input type="number" value={r.rent} onChange={(e) => update(r.id, 'rent', e.target.value)} className="input" placeholder="Rent ₹ / month" />
          {rows.length > 1 && (
            <button type="button" onClick={() => removeRow(r.id)} className="text-red-500 text-xs underline justify-self-start">
              Remove
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addRow} className="text-brand-dark text-sm underline">
        + Add another sharing type
      </button>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${active ? 'bg-brand-dark text-white' : 'text-gray-500 hover:text-brand-dark'}`}>
      {icon} {label}
    </button>
  );
}

function Field({ label, children, required, full }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="text-xs font-medium text-gray-600 mb-1 block">
        {label} {required && <span className="text-sale">*</span>}
      </label>
      {children}
    </div>
  );
}