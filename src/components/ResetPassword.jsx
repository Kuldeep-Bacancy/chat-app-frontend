import React from 'react'
import { useForm } from 'react-hook-form'
import { resetPassword } from '../services/users'
import { toast } from 'react-toastify'
import { useSearchParams } from 'react-router-dom'

function ResetPassword() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [searchParams, setSearchParams] = useSearchParams();

  const resetPasswordHandler = async (data) => {
    try {
      const resetPasswordToken = searchParams.get('token')
      const newData = { ...data, resetPasswordToken: resetPasswordToken }
      const res = await resetPassword(newData)
      toast.success(res.data.message)
      reset()
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Reset Your Password
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(resetPasswordHandler)}>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter your new password"
                  {...register('newPassword', { required: 'Password is required!' })}
                />
                <p className='error'>{errors.newPassword?.message}</p>
              </div>
              <div>
                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Re-enter your new password"
                  required=""
                  {...register('confirmNewPassword', { required: 'Confirm Password is required!' })}
                />
                <p className='error'>{errors.confirmNewPassword?.message}</p>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResetPassword