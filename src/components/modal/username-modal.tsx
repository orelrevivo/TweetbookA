import { Dialog } from '@headlessui/react';
import { CustomIcon } from '@components/ui/custom-icon';
import { Button } from '@components/ui/button';
import { useState, FormEvent, MouseEvent } from 'react';

type UsernameModalProps = {
  loading: boolean;
  children: React.ReactNode;
  available: boolean;
  alreadySet: boolean;
  changeUsername: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  cancelUpdateUsername: () => void;
};

const usernameModalData = [
  {
    title: 'What should we call you?',
    description: 'Your @username is unique. You can always change it later.',
    additionalDescription: 'Remember that when you change your name and ID, you will have to click on the re-profile button located in the sidebar on the left side of the page so that you can see your profile again and updated!',
    cancelLabel: 'Skip'
  },
  {
    title: 'Change your username?',
    description: 'Your @username is unique. You can always change it here again.',
    additionalDescription: 'Remember that when you change your name and ID, you will have to click on the re-profile button located in the sidebar on the left side of the page so that you can see your profile again and updated!',
    cancelLabel: 'Cancel'
  }
] as const;

const translations = {
  English: 'Remember that when you change your name and ID, you will have to click on the re-profile button located in the sidebar on the left side of the page so that you can see your profile again and updated!',
  Japanese: '名前とIDを変更した場合は、ページの左側にあるサイドバーの再プロフィールボタンをクリックする必要があることを覚えておいてください。そうすれば、再度更新されたプロフィールを確認できます。',
  Hebrew: 'זכור שכאשר תשנה את שמך ואת מזהה המשתמש שלך, תצטרך ללחוץ על כפתור "שחזור פרופיל" שנמצא בסרגל הצד בצד שמאל של הדף כך שתוכל לראות את הפרופיל שלך שוב ומעודכן!',
  Russian: 'Помните, что когда вы измените свое имя и ID, вам нужно будет нажать на кнопку "Обновить профиль", расположенную в боковой панели слева на странице, чтобы снова увидеть свой обновленный профиль!',
};

export function UsernameModal({
  loading,
  children,
  available,
  alreadySet,
  changeUsername,
  cancelUpdateUsername
}: UsernameModalProps): JSX.Element {
  const { title, description, additionalDescription, cancelLabel } = usernameModalData[+alreadySet];
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Japanese' | 'Hebrew' | 'Russian'>('English');

  const filteredLanguages = Object.keys(translations).filter(language =>
    language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language as 'English' | 'Japanese' | 'Hebrew' | 'Russian');
    setDropdownOpen(false);
  };

  return (
    <form
      className='flex h-full flex-col justify-between'
      onSubmit={changeUsername}
    >
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Dialog.Title className='text-2xl font-bold xs:text-3xl sm:text-4xl'>
              {title}
            </Dialog.Title>
            <Dialog.Description className='text-light-secondary dark:text-dark-secondary'>
              {description}
            </Dialog.Description>
            <Dialog.Description className='text-light-secondary dark:text-dark-secondary'>
              {translations[selectedLanguage]}
            </Dialog.Description>
            <div className='flex flex-col items-center mt-4'>
              <Button
                type='button'
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className='w-[200px] h-[40px] flex items-center justify-center bg-light-primary text-white border border-light-primary hover:bg-light-primary/90 dark:bg-light-border dark:text-light-primary dark:hover:bg-light-border/90'
              >
                {selectedLanguage}
              </Button>
              {isDropdownOpen && (
                <div className='relative mt-2'>
              <input
  type='text'
  placeholder='Search...'
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{
    width: '200px',
    height: '40px',
    padding: '8px 12px',
    border: '1px solid #E1E8ED', // Similar to Twitter's border color
    borderRadius: '9999px', // Rounded border similar to Twitter's style
    outline: 'none', // Remove default outline
    fontSize: '14px', // Match the font size used by Twitter
    color: '#14171A', // Text color similar to Twitter's
    backgroundColor: '#FFFFFF', // White background similar to Twitter's input
  }}
  onFocus={(e) => e.target.style.border = '1px solid #E1E8ED'} // Keep border color same on focus
  onBlur={(e) => e.target.style.border = '1px solid #E1E8ED'} // Keep border color same on blur
/>

                  <div className='absolute z-10 mt-2 w-[200px] bg-white border border-gray-300 rounded-md shadow-lg'>
                    {filteredLanguages.map((language) => (
                      <button
                        key={language}
                        className='w-full text-left px-2 py-1 hover:bg-gray-100'
                        onClick={() => handleLanguageChange(language)}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {children}
      </div>
      <div className='flex flex-col gap-3 inner:py-2 inner:font-bold'>
        <Button
          className='bg-light-primary text-white transition focus-visible:bg-light-primary/90
            enabled:hover:bg-light-primary/90 enabled:active:bg-light-primary/80
            dark:bg-light-border dark:text-light-primary dark:focus-visible:bg-light-border/90
            dark:enabled:hover:bg-light-border/90 dark:enabled:active:bg-light-border/75'
          type='submit'
          loading={loading}
          disabled={!available}
        >
          Set username
        </Button>
        <Button
          className='border border-light-line-reply hover:bg-light-primary/10 focus-visible:bg-light-primary/10
            active:bg-light-primary/20 dark:border-light-secondary dark:text-light-border
            dark:hover:bg-light-border/10 dark:focus-visible:bg-light-border/10
            dark:active:bg-light-border/20'
          onClick={cancelUpdateUsername}
        >
          {cancelLabel}
        </Button>
      </div>
    </form>
  );
}
