interface IMailConfig {
    driver: 'ethereal' | 'ses';

    defaults: {
        from: {
            email: string;
            name: string;
        };
    };
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',

    defaults: {
        from: {
            email: 'marcelo@marcelogaldino.dev.br',
            name: 'Marcelo do Marcelo Galdino DEV',
        },
    },
} as IMailConfig;
