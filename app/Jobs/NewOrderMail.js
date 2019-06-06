'use strict'
const Mail = use('Mail')

class NewOrderMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'NewOrderMail-job'
  }

  // This is where the work is done.
  async handle ({ email, first_name, name, amount }) {
    console.log(`Job:${NewOrderMail.key}`)
    await Mail.send(
      ['emails.pending_amount'],
      { first_name, name, amount },
      message => {
        message
          .to(email)
          .from('felipe1693@gmail.com', 'Luiz Castro')
          .subject('Uma nova pendencia para você')
      }
    )
  }
}

module.exports = NewOrderMail
