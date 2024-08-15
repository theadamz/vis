<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models\Application{
/**
 * 
 *
 * @property string $id
 * @property string $role_id
 * @property string $code
 * @property string $permission read,edit,delete,validation,etc
 * @property bool $is_allowed
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Access newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Access newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Access query()
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereIsAllowed($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access wherePermission($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereRoleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereUpdatedBy($value)
 * @mixin \Eloquent
 */
	class Access extends \Eloquent {}
}

namespace App\Models\Application{
/**
 * 
 *
 * @property string $id
 * @property string $name
 * @property string|null $def_path
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Role newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Role newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Role query()
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereDefPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereUpdatedBy($value)
 * @mixin \Eloquent
 */
	class Role extends \Eloquent {}
}

namespace App\Models\Application{
/**
 * 
 *
 * @property string $id
 * @property string $ip
 * @property string|null $os
 * @property string|null $platform
 * @property string|null $browser
 * @property string|null $country
 * @property string|null $city
 * @property string $user_id
 * @property string $created_at
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory query()
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereBrowser($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereCity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereCountry($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereIp($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereOs($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory wherePlatform($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereUserId($value)
 * @mixin \Eloquent
 */
	class SignInHistory extends \Eloquent {}
}

namespace App\Models\Application{
/**
 * 
 *
 * @property string $id
 * @property string $code
 * @property string $name
 * @property bool $is_active
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Site newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Site newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Site query()
 * @method static \Illuminate\Database\Eloquent\Builder|Site whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Site whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Site whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Site whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Site whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Site whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Site whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Site whereUpdatedBy($value)
 * @mixin \Eloquent
 */
	class Site extends \Eloquent {}
}

namespace App\Models\Application{
/**
 * 
 *
 * @property string $id
 * @property string $site_id
 * @property int $year
 * @property int $month
 * @property string $transaction_type_id
 * @property int $next_no
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence query()
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereMonth($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereNextNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereSiteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereTransactionTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereYear($value)
 * @mixin \Eloquent
 */
	class TransactionSequence extends \Eloquent {}
}

namespace App\Models\Application{
/**
 * 
 *
 * @property string $id
 * @property string $code
 * @property string $name
 * @property string $prefix
 * @property string $suffix
 * @property int $length_seq
 * @property string $format_seq
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType query()
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereFormatSeq($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereLengthSeq($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType wherePrefix($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereSuffix($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereUpdatedBy($value)
 * @mixin \Eloquent
 */
	class TransactionType extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property string $id
 * @property string $username
 * @property string $email
 * @property mixed $password
 * @property string $name
 * @property string $role_id
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string|null $remember_token
 * @property bool $is_active
 * @property string $site_id
 * @property string|null $last_change_password_at
 * @property string|null $last_login_at
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read Role $role
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereLastChangePasswordAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereLastLoginAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRoleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereSiteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUsername($value)
 * @mixin \Eloquent
 */
	class User extends \Eloquent {}
}

