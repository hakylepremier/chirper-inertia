# Process for building Chirper

## Create Project and download breeze

## Creating Chirps

### Make Chirper model and migration file

-   Run this in the terminal: `php artisan make:model -mrc Chirp`

### Routing

<br>
1. Add a new route to web.php file

```php
use App\Http\Controllers\ChirpController;

Route::resource('chirps', ChirpController::class)
    ->only(['index', 'store'])
    ->middleware(['auth', 'verified']);
```

<br>
2. Add index function to route controller

-   For testing try this:

```php
use Illuminate\Http\Response;

/**
 * Display a listing of the resource.
 */
public function index(): Response
{
    return response('Hello, World!');
}
```

-   Now change it to render an inertia view

```php
use Inertia\Inertia;
use Inertia\Response;
/**
 * Display a listing of the resource.
 */
public function index(): Response
{
    return Inertia::render('Chirps/Index', [
        //
    ]);
}
```

<br>

3. Add chirps index react page by creating a page component resources/js/Pages/Chirps/**Index.jsx**, add neccessary code:

```jsx
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm, Head } from "@inertiajs/react";

export default function Index({ auth }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("chirps.store"), { onSuccess: () => reset() });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Chirps" />

            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <form onSubmit={submit}>
                    <textarea
                        value={data.message}
                        placeholder="What's on your mind?"
                        className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        onChange={(e) => setData("message", e.target.value)}
                    ></textarea>
                    <InputError message={errors.message} className="mt-2" />
                    <PrimaryButton className="mt-4" disabled={processing}>
                        Chirp
                    </PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
```

<br>

4. Update the navigation to include a route to the chirps page

-   Open resources/js/Layouts/**AuthenticatedLayout.jsx** and add this:

```jsx
// Look for the <NavLink></NavLink> component and paste the ff after it:
<NavLink href={route('chirps.index')} active={route().current('chirps.index')}>
    Chirps
</NavLink>

// look for the <ResponsiveNavLink></ResponsiveNavLink> and paste the ff:
<ResponsiveNavLink href={route('chirps.index')} active={route().current('chirps.index')}>
    Chirps
</ResponsiveNavLink>
```

### Saving chirps to db

<br>
1. Update our chirp controller to allow saving the chirp to the chirps.store route

-   Open App/Http/Controllers/**ChirpController.php** file and add this code to the necessary place:

```php
use Illuminate\Http\RedirectResponse;

public function store(Request $request): RedirectResponse
{
    //
    $validated = $request->validate([
        'message' => 'required|string|max:255',
    ]);

    $request->user()->chirps()->create($validated);

    return redirect(route('chirps.index'));
}
```

Above code stores the data into the db and redirects back to the index route

NB: TABLE,RELATIONSHIPS of chirps have not yet been created

<br>
2. Add chirps and user model relationships.

-   Open the **User.php** file in the Model folder and add:

```php
use Illuminate\Database\Eloquent\Relations\HasMany;

public function chirps(): HasMany
{
  return $this->hasMany(Chirp::class);
}
```

-   Open the **Chirp.php** file in the Model folder and add:

```php
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}
```

-   Prevent [mass assignment](https://bootcamp.laravel.com/livewire/creating-chirps#mass-assignment-protection) on the Chirps model by adding this:

```php
protected $fillable = [
    'message',
];
```

<br>
3. Update chirps migration with the neccessary db columns

-   Open migration file for chirps and add:

    ```php
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('message');
    ```

-   Now migrate the database: `php artisan migrate`

<br>
4. [Optional] Test to see if validations work and if message is saved to the db

-   For validation, try submitting the form with no message and also try inputting text more than 255 characters long.

-   For saving, try to type a valid sentence like, **"I'm building Chirper with laravel"** and save it. Now to see if it was successful open laravel tinker, `php artisan tinker`, and type `App\Models\Chirp::all()` to see all chirps saved in the databse currently. If successful you should see your message.

## Viewing chirps

### Retrieving Chirps

<br>
1. Update the ChirpController to send all the chirps in the database with their author names and id when the index route is visited.

-   Type this in the terminal: `php artisan make:volt chirps/list`
-   A file will be made called resources/views/livewire/chirps/**list.blade.php**. Open it and add this:

```php
// We'll be adding this in the index function inside this: return Inertia::render('Chirps/Index', [
'chirps' => Chirp::with('user')->latest()->get(),
```

2. Now we create the chirp react component called resources/js/Components/**Chirp.jsx** that will display the chirps created

```jsx
import React from "react";

export default function Chirp({ chirp }) {
    return (
        <div className="p-6 flex space-x-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600 -scale-x-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
            </svg>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-gray-800">{chirp.user.name}</span>
                        <small className="ml-2 text-sm text-gray-600">
                            {new Date(chirp.created_at).toLocaleString()}
                        </small>
                    </div>
                </div>
                <p className="mt-4 text-lg text-gray-900">{chirp.message}</p>
            </div>
        </div>
    );
}
```

<br>

2. Add the new chirp component to the **Index.jsx** file

```jsx
// this needed at the top
import Chirp from "@/Components/Chirp";

// replace function Index({ auth }) with:
export default function Index({ auth, chirps }) {

// paste this under the form
<div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
    {chirps.map(chirp =>
        <Chirp key={chirp.id} chirp={chirp} />
    )}
</div>
```

3. \[Optional\] Relative dates

In our Chirp component we formatted the dates to be human-readable, but we can take that one step further by displaying relative dates using the popular Day.js library.

-   First, install the dayjs NPM package: `npm install dayjs`

-   Then we can use this library in our resources/js/Components/**Chirp.jsx** component to display relative dates:

```jsx
// at the top
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// replace <small className="ml-2 text-sm text-gray-600">{new Date(chirp.created_at).toLocaleString()}</small> with
<small className="ml-2 text-sm text-gray-600">
    {dayjs(chirp.created_at).fromNow()}
</small>;
```

## Editing Chirps

<!-- volt mount ???? -->

1. To edit we add a route to the web.php file

```php
// replace ->only(['index', 'store']) with
->only(['index', 'store', 'update'])
```

1. Create a react edit form component that allows us to edit the message in the chirp component

-   Also adds a dropdown menu with an edit button to chirps that belong to the currently authenticated user. This edit button will change the message into an edit form when pressed

```js
// replace: import React from 'react'; with
import React, { useState } from "react";
import Dropdown from "@/Components/Dropdown";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

// add
import { useForm, usePage } from "@inertiajs/react";

// below this: export default function Chirp({ chirp }) {
// states and submit functions
const { auth } = usePage().props;

const [editing, setEditing] = useState(false);

const { data, setData, patch, clearErrors, reset, errors } = useForm({
    message: chirp.message,
});

const submit = (e) => {
    e.preventDefault();
    patch(route("chirps.update", chirp.id), {
        onSuccess: () => setEditing(false),
    });
};

// under this: <small className="ml-2 text-sm text-gray-600">{dayjs(chirp.created_at).fromNow()}</small>
// compares created at and updated at, if not the same, shows edited
{
    chirp.created_at !== chirp.updated_at && (
        <small className="text-sm text-gray-600"> &middot; edited</small>
    );
}

// beneath the div with the code above
// if user is currently the auth user, shows the dropdown
{
    chirp.user.id === auth.user.id && (
        <Dropdown>
            <Dropdown.Trigger>
                <button>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                </button>
            </Dropdown.Trigger>
            <Dropdown.Content>
                <button
                    className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out"
                    onClick={() => setEditing(true)}
                >
                    Edit
                </button>
            </Dropdown.Content>
        </Dropdown>
    );
}

// it will replace: <p className="mt-4 text-lg text-gray-900">{chirp.message}</p>
// this is the edit form
{
    editing ? (
        <form onSubmit={submit}>
            <textarea
                value={data.message}
                onChange={(e) => setData("message", e.target.value)}
                className="mt-4 w-full text-gray-900 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
            ></textarea>
            <InputError message={errors.message} className="mt-2" />
            <div className="space-x-2">
                <PrimaryButton className="mt-4">Save</PrimaryButton>
                <button
                    className="mt-4"
                    onClick={() => {
                        setEditing(false);
                        reset();
                        clearErrors();
                    }}
                >
                    Cancel
                </button>
            </div>
        </form>
    ) : (
        <p className="mt-4 text-lg text-gray-900">{chirp.message}</p>
    );
}
```

2. Create a policy to only allow authorized users to update their own chirps

-   Create policy with `php artisan make:policy ChirpPolicy --model=Chirp`

-   Open the app/**ChirpPolicy.php** file and update the update function:

```php
// in the update function
return $chirp->user()->is($user);

// in the other functions
return $user->is(auth()->user());
```

<br>
3. Update the update function in our ChirpController to actually update the chirp

```php
public function update(Request $request, Chirp $chirp): RedirectResponse
{
    $this->authorize('update', $chirp);

    $validated = $request->validate([
        'message' => 'required|string|max:255',
    ]);

    $chirp->update($validated);

    return redirect(route('chirps.index'));
}
```

## Delete Chirps

<br>
1. Open the ChirpPolicy file and add this to the delete function

```php
// anyone authorized to update a chirp will be authorized to delete a chirp by calling the update method here
return $this->update($user, $chirp);
```

2. Create a delete button with delete functionality in the list.blade file

```php
$delete = function (Chirp $chirp) {
    $this->authorize('delete', $chirp);

    $chirp->delete();

    $this->getChirps();
};

// after the edit dropdown
<x-dropdown-link wire:click="delete({{ $chirp->id }})" wire:confirm="Are you sure to delete this chirp?">
    {{ __('Delete') }}
</x-dropdown-link>
```

## Notifications & Events

### Creating the notification

1. Create file with artisan command `php artisan make:notification NewChirp`

2. Now we send the newly created chirp to the notification and include the author's name along with a snippet of the message.

```php
// this should be imported for everything to work
use App\Models\Chirp;
use Illuminate\Support\Str;

// replace the construct function with this
public function __construct(public Chirp $chirp)

// replace the first line and action with this, leave the last line
->subject("New Chirp from {$this->chirp->user->name}")
->greeting("New Chirp from {$this->chirp->user->name}")
->line(Str::limit($this->chirp->message, 50))
->action('Go to Chirper', url('/'))
```

### Creating events

-   Create event with `php artisan make:event ChirpCreated`

-   Add this to the event file app/Events/**ChirpCreated.php**:

```php
public function __construct(public Chirp $chirp)
```

### Dispatching Event

Since the creation of a chirp is what triggers the event we'll dispatch it from the Chirp model file with this code

```php
protected $dispatchesEvents = [
    'created' => ChirpCreated::class,
];
```

### Creating Evenmt Listeners

We'll make an event listener to listen to the Chirp created event with this `php artisan make:listener SendChirpCreatedNotifications --event=ChirpCreated` and we'll add this code to this file app/Listeners/**SendChirpCreatedNotifications.php**:

```PHP
//depends on these
use App\Models\User;
use App\Notifications\NewChirp;

// replaces this: class SendChirpCreatedNotifications
class SendChirpCreatedNotifications implements ShouldQueue

// put this in the handle function
// this sends a notification to all users except the author when a chirp is created
foreach (User::whereNot('id', $event->chirp->user_id)->cursor() as $user) {
    $user->notify(new NewChirp($event->chirp));
}
```

### Register event listener

Open the **EventServiceProvider** class and register the event so that it invokes the event listener when the event is dispatched.
Type this:

```php
// in the protected $listen property add this:
ChirpCreated::class => [
    SendChirpCreatedNotifications::class,
],
```
