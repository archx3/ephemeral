$(document)
    .ready(function() {
        $('.ui.form')
            .form({
                fields: {
                    username: {
                        identifier  : 'username',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter your username'
                            },
                        ]
                    },
                    password: {
                        identifier  : 'password',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter your password'
                            },
                            {
                                type   : 'length[6]',
                                prompt : 'Your password must be at least 6 characters'
                            },
                            {
                                type: 'match[confirm]',
                                prompt: "Your passwords don't match"
                            }
                        ]
                    },
                    type: {
                        identifier: 'type',
                        rules: [
                            {
                                type: 'empty',
                                prompt: "Please select an account type"
                            }
                        ]
                    },


                }
            })
        ;
    })
;